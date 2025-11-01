# ResumeAI - AI-Powered Resume Builder

An intelligent resume builder powered by Google's Gemini AI that helps you create professional, ATS-friendly resumes through conversational AI.

## Project Structure

```
.
├── resumeai-frontend/    # React frontend application
├── resumeai-backend/     # Node.js/Express API server
├── design/               # UI design mockups
├── guide1.md            # Development guide (Chinese)
└── guide2.md            # Best practices guide (Chinese)
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd resumeai-backend
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your Gemini API key to the `.env` file:
```
GEMINI_API_KEY=your_actual_api_key_here
PORT=5001
```

**Note**: Port 5001 is used instead of 5000 because macOS AirPlay Receiver occupies port 5000 by default.

4. Install dependencies (already done):
```bash
npm install
```

5. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd resumeai-frontend
```

2. Create a `.env` file (optional):
```bash
cp .env.example .env
```

3. Install dependencies (already done):
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Features

- ✨ AI-powered resume content generation
- 💬 Conversational interface for data collection
- 📄 Professional, ATS-friendly resume template
- 💾 PDF export functionality
- 🔄 Save and load resume drafts (localStorage)

## Technology Stack

**Frontend:**
- React
- React Router DOM
- Axios
- CSS3

**Backend:**
- Node.js
- Express
- Google Gemini AI API
- CORS
- dotenv

## API Endpoints

- `GET /api/health` - Health check endpoint (http://localhost:5001/api/health)
- `POST /api/chat/message` - Send message to AI for resume generation

## Development Status

**Phase 1: Project Setup** ✅
- [x] React frontend initialized
- [x] Node.js/Express backend initialized
- [x] Gemini API integration configured
- [x] Project structure and dependencies set up
- [x] Basic routing implemented

**Phase 2: Landing Page** - Coming next
**Phase 3: AI Chat Interface** - Pending
**Phase 4: Resume Data Collection** - Pending
**Phase 5: Resume Template & Preview** - Pending
**Phase 6: PDF Export** - Pending
**Phase 7: Data Persistence** - Pending
**Phase 8: Polish & Optimization** - Pending

## License

ISC
