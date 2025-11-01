import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumePreview from './pages/ResumePreview';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/builder" element={<ResumeBuilder />} />
          <Route path="/preview" element={<ResumePreview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
