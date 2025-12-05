const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const chatRouter = require('./routes/chat');
const optimizeRouter = require('./routes/optimize');

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ResumeAI Backend is running' });
});

// API routes
app.use('/api/chat', chatRouter);
app.use('/api/optimize', optimizeRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});
