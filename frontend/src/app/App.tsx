import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { UploadPage } from './components/UploadPage';
import { ResultsPage } from './components/ResultsPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}