'use client'

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Building2, Calendar, Award, ArrowUpRight, Download, Mail, Eye, EyeOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createClient } from '@supabase/supabase-js'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [realData, setRealData] = useState<any>(null);
  
  const supabase = createClient(
    'https://qjiscnwrapoyksikrexv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaXNjbndyYXBveWtzaWtyZXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMzk2NzgsImV4cCI6MjA3NTcxNTY3OH0.4KlZF0KOKtzpVc3WRWqMSkvLbLlPRLXyQ5-vu41TFIE' // You'll need to add this from Supabase dashboard
  )

  // Fetch real data from Supabase when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchRealData();
    }
  }, [isAuthenticated]);

  const fetchRealData = async () => {
    try {
      setLoading(true);

      // Fetch all responses
      const { data: responses, error: responsesError } = await supabase
        .from('responses')
        .select('session_id, pillar, is_before, score');

      if (responsesError) throw responsesError;

      // Fetch sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('*');

      if (sessionsError) throw sessionsError;

      // Calculate stats
      const uniqueStudents = new Set(responses?.map((r: any) => r.session_id) || []).size;
      const uniqueSchools = new Set(sessions?.map((s: any) => s.school_name) || []).size;

      // Calculate pillar improvements
      const pillarData = calculatePillarImprovements(responses || []);
      const avgImprovement = calculateOverallAverage(pillarData);

      setRealData({
        totalStudents: uniqueStudents,
        schoolsReached: uniqueSchools,
        matsRepresented: 1,
        avgImprovement,
        pillarData,
        sessions: sessions || []
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const calculatePillarImprovements = (responses: any[]) => {
    const pillars = [
      { name: 'Hope', key: 'hope', color: '#e90d88' },
      { name: 'Confidence', key: 'confidence', color: '#05b0fe' },
      { name: 'Happiness', key: 'happiness', color: '#fe8210' },
      { name: 'Relationships', key: 'relationships', color: '#16af81' },
      { name: 'Employability', key: 'employability', color: '#7c04d5' }
    ];

    return pillars.map(pillar => {
      const pillarResponses = responses.filter(r => r.pillar === pillar.key);
      
      const beforeScores = pillarResponses
        .filter(r => r.is_before === true)
        .map(r => r.score);
      
      const afterScores = pillarResponses
        .filter(r => r.is_before === false)
        .map(r => r.score);
      
      const beforeAvg = beforeScores.length > 0 
        ? beforeScores.reduce((a, b) => a + b, 0) / beforeScores.length 
        : 0;
        
      const afterAvg = afterScores.length > 0
        ? afterScores.reduce((a, b) => a + b, 0) / afterScores.length 
        : 0;
      
      const improvement = beforeAvg > 0 
        ? ((afterAvg - beforeAvg) / beforeAvg) * 100 
        : 0;

      return {
        name: pillar.name,
        before: Number(beforeAvg.toFixed(1)),
        after: Number(afterAvg.toFixed(1)),
        improvement: Number(improvement.toFixed(1)),
        color: pillar.color
      };
    });
  };

  const calculateOverallAverage = (pillarData: any[]) => {
    if (pillarData.length === 0) return 0;
    const total = pillarData.reduce((sum, p) => sum + p.improvement, 0);
    return Number((total / pillarData.length).toFixed(1));
  };

  const pillarColors: Record<string, string> = {
    hope: '#e90d88',
    confidence: '#05b0fe',
    happiness: '#fe8210',
    relationships: '#16af81',
    employability: '#7c04d5'
  };

  const handleLogin = () => {
    if (password === 'humanutopia2025') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Use real data if available, otherwise show loading or empty state
  const displayData = realData || {
    totalStudents: 0,
    schoolsReached: 0,
    matsRepresented: 0,
    avgImprovement: 0,
    pillarData: [],
    sessions: []
  };

  const pillarDataForChart = displayData.pillarData;

  const matData = [
    {
      name: 'OASIS COMMUNITY LEARNING',
      schools: displayData.sessions.map((s: any) => s.school_name),
      totalStudents: displayData.totalStudents,
      sessions: displayData.sessions.length,
      avgImprovement: displayData.avgImprovement
    }
  ];

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                hu
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#303030' }}>Admin Dashboard</h1>
            <p className="text-slate-600">Impact analytics and insights</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-pink-500 focus:outline-none"
                  style={{ color: '#303030' }}
                  placeholder="Enter admin password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-lg font-bold text-white shadow-lg hover:shadow-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #e90d88, #f92706)'
              }}
            >
              Access Dashboard
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Humanutopia Impact Survey Analytics
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-lg font-semibold text-slate-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                hu
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#303030' }}>Impact Dashboard</h1>
                <p className="text-sm text-slate-500">Real-time analytics and insights</p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'pillars', label: '5 Pillars', icon: Award },
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'mats', label: 'MAT Impact', icon: Building2 }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition border-b-2 ${
                    view === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TabIcon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <Users className="text-pink-500 mb-4" size={32} />
                <div className="text-4xl font-bold mb-1" style={{ color: '#303030' }}>{displayData.totalStudents}</div>
                <div className="text-sm text-slate-600">Students Surveyed</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <Building2 className="text-blue-500 mb-4" size={32} />
                <div className="text-4xl font-bold mb-1" style={{ color: '#303030' }}>{displayData.schoolsReached}</div>
                <div className="text-sm text-slate-600">Schools Reached</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <Award className="text-orange-500 mb-4" size={32} />
                <div className="text-4xl font-bold mb-1" style={{ color: '#303030' }}>{displayData.matsRepresented}</div>
                <div className="text-sm text-slate-600">MATs Represented</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <TrendingUp className="text-green-500 mb-4" size={32} />
                <div className="text-4xl font-bold mb-1" style={{ color: '#303030' }}>{displayData.avgImprovement}%</div>
                <div className="text-sm text-slate-600">Average Improvement</div>
              </div>
            </div>

            {/* Quick Impact Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-xl font-bold mb-6" style={{ color: '#303030' }}>5 Pillar Impact Overview</h2>
              {pillarDataForChart.length > 0 ? (
                <div className="space-y-4">
                  {pillarDataForChart.map((pillar: any) => (
                    <div key={pillar.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-700">{pillar.name}</span>
                        <span className="font-bold" style={{ color: pillar.color }}>
                          +{pillar.improvement.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(pillar.improvement, 100)}%`,
                            background: `linear-gradient(90deg, ${pillar.color}dd, ${pillar.color})`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No survey data yet</p>
              )}
            </div>

            {/* Recent Session */}
            {displayData.sessions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#303030' }}>Latest Session</h2>
                <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg p-6 border border-pink-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: '#303030' }}>{displayData.sessions[0].school_name}</h3>
                      <p className="text-sm text-slate-600">{displayData.sessions[0].year_group} • {new Date(displayData.sessions[0].session_date).toLocaleDateString()}</p>
                      <p className="text-sm text-slate-600">Facilitator: {displayData.sessions[0].facilitator_name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-pink-600">{displayData.totalStudents}</div>
                      <div className="text-xs text-slate-600">students</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-white rounded-lg font-semibold text-slate-700 hover:shadow-md transition text-sm">
                      <Download className="inline mr-2" size={16} />
                      Download Report
                    </button>
                    <button className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition text-sm">
                      <Mail className="inline mr-2" size={16} />
                      Email School
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'pillars' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#303030' }}>Pillar Deep Dive</h2>
              
              {pillarDataForChart.length > 0 ? (
                <>
                  {/* Before vs After Chart */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-slate-700 mb-4">Before vs After Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={pillarDataForChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" domain={[0, 10]} />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="before" fill="#94a3b8" name="Before Workshop" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="after" fill="#e90d88" name="After Workshop" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Individual Pillar Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pillarDataForChart.map((pillar: any) => (
                      <div key={pillar.name} className="bg-slate-50 rounded-xl p-6 border-2" style={{ borderColor: `${pillar.color}33` }}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold" style={{ color: '#303030' }}>{pillar.name}</h3>
                          <ArrowUpRight style={{ color: pillar.color }} />
                        </div>
                        <div className="text-4xl font-bold mb-2" style={{ color: pillar.color }}>
                          +{pillar.improvement.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <div>Before: {pillar.before.toFixed(1)}/10</div>
                          <div>After: {pillar.after.toFixed(1)}/10</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-slate-500 text-center py-8">No survey data yet</p>
              )}
            </div>
          </div>
        )}

        {view === 'mats' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#303030' }}>MAT Impact Reports</h2>
              <p className="text-slate-600 mb-6">View collective impact across Multi-Academy Trusts</p>
              
              {matData.map(mat => (
                <div key={mat.name} className="border-2 border-slate-200 rounded-xl p-6 mb-4">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#303030' }}>{mat.name}</h3>
                      <div className="flex gap-6 text-sm">
                        <span className="text-slate-600">
                          <span className="font-bold" style={{ color: '#303030' }}>{mat.schools.length}</span> schools
                        </span>
                        <span className="text-slate-600">
                          <span className="font-bold" style={{ color: '#303030' }}>{mat.totalStudents}</span> students
                        </span>
                        <span className="text-slate-600">
                          <span className="font-bold" style={{ color: '#303030' }}>{mat.sessions}</span> sessions
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-pink-600">+{mat.avgImprovement}%</div>
                      <div className="text-xs text-slate-600">avg improvement</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-3" style={{ color: '#303030' }}>Schools in Trust:</h4>
                    <ul className="space-y-2">
                      {mat.schools.map((school: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-700">
                          <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                          {school}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition">
                    Download MAT Impact Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}