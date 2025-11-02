/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Handle canvas for @react-pdf/renderer
    if (isServer) {
      config.resolve.alias.canvas = false
    }

    // Ignore specific warnings from @react-pdf/renderer
    config.ignoreWarnings = [
      { module: /node_modules\/@react-pdf\/renderer/ },
    ]

    return config
  },
  transpilePackages: ['@react-pdf/renderer'],
}

export default nextConfig
