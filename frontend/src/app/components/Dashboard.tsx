import { useState,useEffect } from 'react';
import { Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios'; 
const API_BASE = import.meta.env.VITE_API_BASE;


interface CandidateRecord {
  id: string;
  name: string;
  email: string;
  score: number;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  appliedDate: string;
  position: string;
}

export function Dashboard() {
  const [sortField, setSortField] = useState<'score' | 'appliedDate'>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<any[]>([]);   // 🔥 NEW
  useEffect(() => {
  axios.get(`${API_BASE}/results`)
    .then(res => setData(res.data.results))
    .catch(err => console.error(err));
}, []);

  const mockData: CandidateRecord[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      score: 92,
      status: 'shortlisted',
      appliedDate: '2026-04-25',
      position: 'Senior React Developer'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      email: 'michael.r@email.com',
      score: 87,
      status: 'reviewed',
      appliedDate: '2026-04-24',
      position: 'Full Stack Engineer'
    },
    {
      id: '3',
      name: 'Emily Watson',
      email: 'emily.watson@email.com',
      score: 78,
      status: 'pending',
      appliedDate: '2026-04-26',
      position: 'Frontend Developer'
    },
    {
      id: '4',
      name: 'James Kim',
      email: 'james.kim@email.com',
      score: 71,
      status: 'pending',
      appliedDate: '2026-04-27',
      position: 'Software Engineer'
    },
    {
      id: '5',
      name: 'Rachel Martinez',
      email: 'rachel.m@email.com',
      score: 85,
      status: 'shortlisted',
      appliedDate: '2026-04-23',
      position: 'Senior React Developer'
    },
    {
      id: '6',
      name: 'David Park',
      email: 'david.park@email.com',
      score: 68,
      status: 'reviewed',
      appliedDate: '2026-04-22',
      position: 'Frontend Developer'
    }
  ];
  const mappedData = data.map((c, index) => ({
  id: index.toString(),
  name: c.filename,
  email: "N/A",
  score: c.score,
  status: "pending",
  appliedDate: new Date().toISOString(),
  position: "Resume Candidate"
}));
  const filteredData = mappedData
    .filter(candidate => {
      const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
      const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'score') {
        return (a.score - b.score) * multiplier;
      }
      return (new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()) * multiplier;
    });

  const toggleSort = (field: 'score' | 'appliedDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted': return 'bg-primary/10 text-primary';
      case 'reviewed': return 'bg-secondary/10 text-secondary';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-foreground">Candidates Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and review all candidate applications
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none text-foreground cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Candidate</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Position</th>
                  <th
                    className="px-6 py-4 text-left text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => toggleSort('score')}
                  >
                    <div className="flex items-center gap-2">
                      Match Score
                      {sortField === 'score' && (
                        sortDirection === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Status</th>
                  <th
                    className="px-6 py-4 text-left text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => toggleSort('appliedDate')}
                  >
                    <div className="flex items-center gap-2">
                      Applied Date
                      {sortField === 'appliedDate' && (
                        sortDirection === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-foreground">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{candidate.position}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[120px] bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${candidate.score}%`,
                              backgroundColor: candidate.score >= 80 ? '#6366f1' : candidate.score >= 70 ? '#a78bfa' : '#94a3b8'
                            }}
                          />
                        </div>
                        <span className="text-foreground min-w-[45px]">{candidate.score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(candidate.appliedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No candidates found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
