import React, { useState, useMemo } from 'react';
import { Users, TrendingUp, Target, Award } from 'lucide-react';

const TeamPerformance = ({ projects, timesheets }) => {
  const [viewType, setViewType] = useState('overview');
  const [sortBy, setSortBy] = useState('productivity');

  const teamMetrics = useMemo(() => {
    // Mock team data for demonstration
    return [
      {
        id: 1,
        name: 'John Doe',
        role: 'Developer',
        productivityScore: 85,
        efficiency: 92,
        qualityScore: 88,
        collaborationScore: 90,
        overallScore: 89
      },
      {
        id: 2,
        name: 'Jane Smith',
        role: 'Designer',
        productivityScore: 78,
        efficiency: 85,
        qualityScore: 92,
        collaborationScore: 88,
        overallScore: 86
      },
      {
        id: 3,
        name: 'Mike Johnson',
        role: 'Project Manager',
        productivityScore: 92,
        efficiency: 88,
        qualityScore: 85,
        collaborationScore: 95,
        overallScore: 90
      }
    ];
  }, [projects, timesheets]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
        <select
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="overview">Overview</option>
          <option value="individual">Individual</option>
          <option value="comparison">Comparison</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-semibold text-gray-900">{teamMetrics.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Performance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(teamMetrics.reduce((sum, member) => sum + member.overallScore, 0) / teamMetrics.length)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Performer</p>
              <p className="text-2xl font-semibold text-gray-900">
                {teamMetrics.reduce((max, member) => member.overallScore > max ? member.overallScore : max, 0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Team Members Performance</h4>
        </div>
        <div className="divide-y divide-gray-200">
          {teamMetrics.map((member) => (
            <div key={member.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">{member.name}</h5>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{member.overallScore}%</div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPerformance;
