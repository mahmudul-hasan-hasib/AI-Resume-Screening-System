import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Award, Briefcase, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);

  // ✅ Real data from backend
  const results = location.state?.results || [];

  useEffect(() => {
    const timer = setTimeout(() => setShowResults(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // ❌ No data হলে redirect
  if (!results.length) {
    navigate('/');
    return null;
  }

  // ✅ Calculations
  const avgScore = Math.round(
    results.reduce((acc: number, c: any) => acc + c.score, 0) / results.length
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* 🔙 Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </button>

        {/* 🧠 Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-foreground">Analysis Results</h1>
          <p className="text-muted-foreground">
            Analyzed {results.length} candidates
          </p>
        </div>

        {/* 📊 Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          {/* Top */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-muted-foreground">Top Match</h3>
            </div>
            <p className="text-2xl text-foreground">
              {results[0].score}%
            </p>
          </div>

          {/* Avg */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-muted-foreground">Average Score</h3>
            </div>
            <p className="text-2xl text-foreground">{avgScore}%</p>
          </div>

          {/* Count */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent rounded-lg">
                <Briefcase className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="text-muted-foreground">Candidates Reviewed</h3>
            </div>
            <p className="text-2xl text-foreground">{results.length}</p>
          </div>
        </div>

        {/* 🧾 Result List */}
        <div className={`bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-0'}`}>

          <div className="p-6 border-b border-border">
            <h2 className="text-foreground">Candidate Rankings</h2>
          </div>

          <div className="divide-y divide-border">
            {results.map((candidate: any, index: number) => (
              <div key={index} className="p-6 hover:bg-muted/30 transition-colors">

                {/* Top section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                        #{index + 1}
                      </span>
                      <h3 className="text-foreground">
                        {candidate.filename || `Candidate ${index + 1}`}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl mb-1">
                      {candidate.score}%
                    </div>
                    <p className="text-xs text-muted-foreground">Match Score</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${candidate.score}%` }}
                    />
                  </div>
                </div>

                {/* Keywords (existing UI) */}
                {candidate.matched_keywords && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Matched Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.matched_keywords.map((kw: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}