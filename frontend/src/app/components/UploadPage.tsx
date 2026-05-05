import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from './FileUpload';
import { ArrowRight, Sparkles } from 'lucide-react';
import axios from "axios";
export function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  

  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const handleAnalyze = async () => {
  if (files.length === 0 || !jobDescription.trim()) return;

  if (files.some(f => !f.name.endsWith(".pdf"))) {
    alert("Only PDF files allowed");
    return;
  }

  setIsAnalyzing(true);

  try {
    // 🔼 1. Upload files
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const uploadRes = await axios.post(
      `${API_BASE}/upload-cv`,
      formData
    );

    const uploadedFiles = uploadRes.data.files;

    // 🧠 2. Start analyze (returns task_id)
    const analyzeRes = await axios.post(
      `${API_BASE}/analyze`,
      {
        job_description: jobDescription,
        files: uploadedFiles
      }
    );

    const taskId = analyzeRes.data.task_id;

    // 🔁 3. Polling function
    const checkStatus = async () => {
      try {
        const res = await axios.get(`${API_BASE}/task-status/${taskId}`);

        if (res.data.status === "SUCCESS") {
          // ✅ DONE → get result
          navigate("/results", {
            state: { results: res.data.result }
          });
        } else if (res.data.status === "FAILURE") {
          alert("Analysis failed");
          setIsAnalyzing(false);
        } else {
          // ⏳ still processing → check again
          setTimeout(checkStatus, 2000);
        }
      } catch (err) {
        console.error(err);
        setIsAnalyzing(false);
      }
    };

    // 🚀 start polling
    checkStatus();

  } catch (err) {
    console.error(err);
    alert("Failed to analyze resumes");
    setIsAnalyzing(false);
  }
};

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-accent-foreground">AI-Powered Screening</span>
          </div>
          <h1 className="text-4xl mb-3 text-foreground">Find the Perfect Candidate</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload resumes and provide a job description to instantly analyze and rank candidates
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="mb-6 text-foreground">Upload Resumes</h2>
            <FileUpload onFilesChange={setFiles} multiple={true} />
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="mb-6 text-foreground">Job Description</h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste your job description here...&#10;&#10;Example:&#10;- 5+ years of React experience&#10;- Strong TypeScript skills&#10;- Experience with Node.js&#10;- Team leadership abilities"
              className="w-full h-[280px] p-4 bg-input-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleAnalyze}
            disabled={files.length === 0 || !jobDescription.trim() || isAnalyzing}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-3 shadow-lg shadow-primary/20"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing Resumes...
              </>
            ) : (
              <>
                Analyze Resumes
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {files.length > 0 && jobDescription.trim() && (
          <div className="mt-8 p-4 bg-accent/30 border border-accent rounded-xl">
            <p className="text-sm text-accent-foreground text-center">
              Ready to analyze <strong>{files.length}</strong> resume{files.length > 1 ? 's' : ''}
              {' '}against your job requirements
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
