import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  AlertTriangle,
  CheckCircle,
  Star,
  Calendar,
  BarChart3
} from 'lucide-react';

const TeamPerformance = ({ projects, timesheets }) => {
  const { users } = useSelector((state) => state.users);
  const [viewType, setViewType] = useState('overview');
  const [sortBy, setSortBy] = useState('productivity');

  // Calculate team performance metrics
  const teamMetrics = useMemo(() => {
    const teamMembers = users.filter(user => user.role === 'team');
    
    return teamMembers.map(member => {
      // Get member's projects
      const memberProjects = projects.filter(project => 
        project.teamMembers?.includes(member.id)
      );
      
      // Get member's timesheets
      const memberTimesheets = timesheets.filter(ts => 
        ts.userId === member.id
      );
      
      // Calculate productivity score
      const totalHours = memberTimesheets.reduce((sum, ts) => sum + ts.hours, 0);
      const completedTasks = memberProjects.filter(p => p.status === 'Completed').length;
      const totalTasks = memberProjects.length;
      const productivityScore = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      // Calculate efficiency (hours vs estimated)
      const estimatedHours = memberProjects.reduce((sum, project) => 
        sum + (project.estimatedHours || 0), 0
      );
      const efficiency = estimatedHours > 0 ? 
        ((estimatedHours - totalHours) / estimatedHours) * 100 : 100;
      
      // Calculate average response time (mock data)
      const avgResponseTime = Math.random() * 24 + 2; // 2-26 hours
      
      // Calculate quality score based on project success
      const qualityScore = memberProjects.length > 0 ? 
        memberProjects.reduce((sum, project) => sum + project.progress, 0) / memberProjects.length : 0;
      
      // Calculate collaboration score
      const collaborationScore = Math.random() * 30 + 70; // 70-100
      
      return {
        ...member,
        totalProjects: memberProjects.length,
        completedProjects: completedTasks,
        totalHours,
        estimatedHours,
        productivityScore: Math.round(productivityScore),
        efficiency: Math.round(efficiency),
        avgResponseTime: Math.round(avgResponseTime),
        qualityScore: Math.round(qualityScore),
        collaborationScore: Math.round(collaborationScore),
        overallScore: Math.round((productivityScore + efficiency + qualityScore + collaborationScore) / 4)
      };
    });
  }, [users, projects, timesheets]);

  // Sort team members
  const sortedTeam = useMemo(() => {
    return [...teamMetrics].sort((a, b) => {
      switch (sortBy) {
        case 'productivity':
          return b.productivityScore - a.productivityScore;
        case 'efficiency':
          return b.efficiency - a.efficiency;
        case 'quality':
          return b.qualityScore - a.qualityScore;
        case 'collaboration':
          return b.collaborationScore - a.collaborationScore;
        case 'overall':
          return b.overallScore - a.overallScore;
        default:
          return b.overallScore - a.overallScore;
      }
    });
  }, [teamMetrics, sortBy]);

  // Calculate team averages
  const teamAverages = useMemo(() => {
    if (teamMetrics.length === 0) return {};
    
    const totalProductivity = teamMetrics.reduce((sum, member) => sum + member.productivityScore, 0);
    const totalEfficiency = teamMetrics.reduce((sum, member) => sum + member.efficiency, 0);
    const totalQuality = teamMetrics.reduce((sum, member) => sum + member.qualityScore, 0);
    const totalCollaboration = teamMetrics.reduce((sum, member) => sum + member.collaborationScore, 0);
    const totalOverall = teamMetrics.reduce((sum, member) => sum + member.overallScore, 0);
    
    return {
      productivity: Math.round(totalProductivity / teamMetrics.length),
      efficiency: Math.round(totalEfficiency / teamMetrics.length),
      quality: Math.round(totalQuality / teamMetrics.length),
      collaboration: Math.round(totalCollaboration / teamMetrics.length),
      overall: Math.round(totalOverall / teamMetrics.length)
    };
  }, [teamMetrics]);

  const viewTypes = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'individual', label: 'Individual Performance', icon: Users },
    { id: 'comparison', label: 'Team Comparison', icon: TrendingUp },
    { id: 'trends', label: 'Performance Trends', icon: Target }
  ];

  const sortOptions = [
    { value: 'overall', label: 'Overall Score' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'efficiency', label: 'Efficiency' },
    { value: 'quality', label: 'Quality' },
    { value: 'collaboration', label: 'Collaboration' }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <Award className="w-4 h-4" />;
    if (score >= 80) return <Star className="w-4 h-4" />;
    if (score >= 70) return <CheckCircle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Performance</h2>
          <p className="text-gray-600">Track individual and team performance metrics</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Type Navigation */}
      <div className="bg-gray-50 rounded-lg p-1">
        <div className="flex space-x-1">
          {viewTypes.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setViewType(view.id)}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewType === view.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {view.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview View */}
      {viewType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Team Size</h3>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {teamMetrics.length}
            </div>
            <p className="text-sm text-gray-600">Active team members</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Avg. Productivity</h3>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {teamAverages.productivity}%
            </div>
            <p className="text-sm text-gray-600">Task completion rate</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Avg. Efficiency</h3>
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {teamAverages.efficiency}%
            </div>
            <p className="text-sm text-gray-600">Time management</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
              <Target className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {teamAverages.overall}%
            </div>
            <p className="text-sm text-gray-600">Team performance</p>
          </div>
        </div>
      )}

      {/* Individual Performance View */}
      {viewType === 'individual' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Individual Performance Metrics</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productivity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efficiency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quality
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overall
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedTeam.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.completedProjects}/{member.totalProjects}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.totalHours}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(member.productivityScore)}`}>
                          {getScoreIcon(member.productivityScore)}
                          <span className="ml-1">{member.productivityScore}%</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(member.efficiency)}`}>
                          {getScoreIcon(member.efficiency)}
                          <span className="ml-1">{member.efficiency}%</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(member.qualityScore)}`}>
                          {getScoreIcon(member.qualityScore)}
                          <span className="ml-1">{member.qualityScore}%</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(member.overallScore)}`}>
                          {getScoreIcon(member.overallScore)}
                          <span className="ml-1">{member.overallScore}%</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Team Comparison View */}
      {viewType === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h3>
            <div className="space-y-4">
              {['overall', 'productivity', 'efficiency', 'quality', 'collaboration'].map((metric) => {
                const scores = teamMetrics.map(member => member[metric]);
                const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
                const max = Math.max(...scores);
                const min = Math.min(...scores);
                
                return (
                  <div key={metric} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{metric}</span>
                      <span className="text-gray-900">Avg: {Math.round(avg)}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 text-xs text-gray-500">{Math.round(min)}%</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(avg - min) / (max - min) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-16 text-xs text-gray-500 text-right">{Math.round(max)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-4">
              {sortedTeam.slice(0, 5).map((member, index) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{member.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{member.overallScore}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Trends View */}
      {viewType === 'trends' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends (Last 6 Months)</h3>
          <div className="space-y-6">
            {['Productivity', 'Efficiency', 'Quality', 'Collaboration'].map((metric) => (
              <div key={metric} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-900">{metric}</h4>
                  <span className="text-sm text-gray-600">
                    {Math.round(teamMetrics.reduce((sum, member) => sum + member[metric.toLowerCase()], 0) / teamMetrics.length)}%
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: 6 }, (_, i) => {
                    const month = new Date();
                    month.setMonth(month.getMonth() - (5 - i));
                    const monthName = month.toLocaleString('default', { month: 'short' });
                    const mockValue = Math.random() * 30 + 70; // 70-100%
                    
                    return (
                      <div key={i} className="flex-1 text-center">
                        <div className="text-xs text-gray-500 mb-1">{monthName}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${mockValue}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{Math.round(mockValue)}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPerformance;

