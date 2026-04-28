import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Award, Briefcase, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Candidate {
  name: string;
  score: number;
  skills: string[];
  matchedKeywords: string[];
  experience: string;
}

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);

  const files = location.state?.files || [];

  const mockCandidates: Candidate[] = [
    {
      name: files[0] || 'Sarah Chen - Senior Developer.pdf',
      score: 92,
      skills: ['React', 'TypeScript', 'Node.js', 'Team Leadership', 'AWS', 'Docker'],
      matchedKeywords: ['React', 'TypeScript', 'Node.js', 'leadership'],
      experience: '7 years'
    },
    {
      name: files[1] || 'Michael Rodriguez - Full Stack Engineer.pdf',
      score: 87,
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'GraphQL'],
      matchedKeywords: ['React', 'Node.js', 'JavaScript'],
      experience: '5 years'
    },
    {
      name: files[2] || 'Emily Watson - Frontend Developer.pdf',
      score: 78,
      skills: ['React', 'TypeScript', 'CSS', 'Redux', 'Testing'],
      matchedKeywords: ['React', 'TypeScript'],
      experience: '4 years'
    },
    {
      name: files[3] || 'James Kim - Software Engineer.pdf',
      score: 71,
      skills: ['JavaScript', 'Vue.js', 'Node.js', 'PostgreSQL'],
      matchedKeywords: ['JavaScript', 'Node.js'],
      experience: '3 years'
    }
  ].slice(0, files.length || 4);

  useEffect(() => {
    const timer = setTimeout(() => setShowResults(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (files.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </button>

        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-foreground">Analysis Results</h1>
          <p className="text-muted-foreground">
            Analyzed {mockCandidates.length} candidates against your job requirements
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-muted-foreground">Top Match</h3>
            </div>
            <p className="text-2xl text-foreground">{mockCandidates[0].score}%</p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-muted-foreground">Average Score</h3>
            </div>
            <p className="text-2xl text-foreground">
              {Math.round(mockCandidates.reduce((acc, c) => acc + c.score, 0) / mockCandidates.length)}%
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent rounded-lg">
                <Briefcase className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="text-muted-foreground">Candidates Reviewed</h3>
            </div>
            <p className="text-2xl text-foreground">{mockCandidates.length}</p>
          </div>
        </div>

        <div className={`bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-6 border-b border-border">
            <h2 className="text-foreground">Candidate Rankings</h2>
          </div>

          <div className="divide-y divide-border">
            {mockCandidates.map((candidate, index) => (
              <div key={index} className="p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                        #{index + 1}
                      </span>
                      <h3 className="text-foreground">{candidate.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{candidate.experience} of experience</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl mb-1" style={{ color: candidate.score >= 80 ? '#6366f1' : candidate.score >= 70 ? '#a78bfa' : '#94a3b8' }}>
                      {candidate.score}%
                    </div>
                    <p className="text-xs text-muted-foreground">Match Score</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${candidate.score}%`,
                        backgroundColor: candidate.score >= 80 ? '#6366f1' : candidate.score >= 70 ? '#a78bfa' : '#94a3b8'
                      }}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-accent/50 text-accent-foreground rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Matched Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.matchedKeywords.map((keyword, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
