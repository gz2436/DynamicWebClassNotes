import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

// Build a reusable TMDB proxy middleware for both dev + preview
const createTmdbProxy = (apiKey) => {
  // Simple in-memory LRU-like cache (Map preserves insertion order)
  const memoryCache = new Map();
  const MAX_CACHE_SIZE = 100;

  const handler = async (req, res, next) => {
    if (!/^\/api\/tmdb([/?]|$)/.test(req.url || '')) return next()

    try {
      const url = new URL(req.url, `http://${req.headers.host}`)
      const endpoint = url.searchParams.get('endpoint')

      // SECURITY 1: Endpoint Whitelist / Sanitization
      if (!endpoint || !endpoint.startsWith('/') || endpoint.includes('..')) {
        console.warn(`[Proxy] BLOCKED Suspicious Request: ${endpoint}`);
        res.statusCode = 403;
        res.end(JSON.stringify({ error: 'Forbidden: Invalid Endpoint' }));
        return;
      }

      if (!apiKey) {
        console.error('[Proxy] ERROR: Configuration missing API Key');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server Config Error' }));
        return;
      }

      // 2. Cache Key Generation (consistent with production)
      url.searchParams.delete('endpoint');
      // Sort params for cache hit consistency
      const sortedParams = new URLSearchParams();
      const keys = Array.from(url.searchParams.keys()).sort();
      keys.forEach(k => sortedParams.set(k, url.searchParams.get(k)));

      const cacheKey = `tmdb_cache:${endpoint}:${sortedParams.toString()}`;

      // 3. Cache Availability Check
      if (memoryCache.has(cacheKey)) {
        console.log(`[Proxy] STAT: HIT ${endpoint}`);
        const cached = memoryCache.get(cacheKey);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Cache', 'HIT');
        res.statusCode = 200;
        res.end(JSON.stringify(cached));
        return;
      }

      // 4. Upstream Fetch
      url.searchParams.append('api_key', apiKey);
      const cleanEndpoint = endpoint; // already validated
      const tmdbUrl = `https://api.themoviedb.org/3${cleanEndpoint}?${url.searchParams.toString()}`;

      const response = await axios.get(tmdbUrl, {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true
      });

      console.log(`[Proxy] STAT: MISS ${endpoint} -> ${response.status}`);

      // ROBUSTNESS: Validate Upstream Response
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        console.error(`[Proxy] ERROR: Invalid Upstream Content-Type: ${contentType}`);
        res.statusCode = 502; // Bad Gateway
        res.end(JSON.stringify({ error: 'Upstream Error', details: 'Invalid Response Format' }));
        return;
      }

      const data = response.data;

      // 5. Write to Cache (if success)
      if (response.status === 200) {
        if (memoryCache.size >= MAX_CACHE_SIZE) {
          const firstKey = memoryCache.keys().next().value;
          memoryCache.delete(firstKey); // LRU Eviction
        }
        memoryCache.set(cacheKey, data);
      }

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('X-Proxy-Target', cleanEndpoint);
      res.statusCode = response.status;
      res.end(JSON.stringify(data));

    } catch (error) {
      console.error('[Proxy] CRITICAL FAILURE:', error.message);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Proxy Failure', details: error.message }));
    }
  }

  return handler
}

// Helper to manually load env (Fail-safe)
function getEnvManual() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const vars = {};
      content.split('\n').forEach(line => {
        const [k, v] = line.split('=');
        if (k && v) vars[k.trim()] = v.trim();
      });
      return vars;
    }
  } catch (e) {
    console.error("Manual env load failed", e);
  }
  return {};
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load strategy: process.env (if set) > Manual .env parse
  const manualEnv = getEnvManual();
  const apiKey = process.env.VITE_TMDB_API_KEY || manualEnv.VITE_TMDB_API_KEY;

  // DX: Startup Validation (Fail Fast)
  if (!apiKey) {
    console.error("\n\n❌ [VITE PROXY] FATAL: VITE_TMDB_API_KEY is missing from .env");
    console.error("   The server cannot start without a valid API key for the proxy.\n");
    throw new Error("Missing VITE_TMDB_API_KEY");
  }

  console.log("--- VITE PROXY SETUP ---");
  console.log("API Key loaded: OK");
  console.log("Memory Cache: Enabled");
  console.log("------------------------");

  const proxyMiddleware = createTmdbProxy(apiKey);

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'tmdb-proxy-middleware',
        configureServer(server) {
          server.middlewares.use(proxyMiddleware);
        },
        configurePreview(server) {
          server.middlewares.use(proxyMiddleware);
        }
      }
    ],
  }
})
