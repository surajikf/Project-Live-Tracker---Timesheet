import React, { useState, useMemo } from 'react';
import { TrendingUp, BarChart3, PieChart, Calendar, Users, Target } from 'lucide-react';

const ProjectAnalytics = ({ projects, timesheets }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [viewType, setViewType] = useState('overview');

  const analytics = useMemo(() => {
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const filteredProjects = projects.filter(project => new Date(project.startDate) >= monthAgo);
    const completedProjects = filteredProjects.filter(p => p.status === 'Completed').length;
    const completionRate = filteredProjects.length > 0 ? (completedProjects / filteredProjects.length) * 100 : 0;

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'In Progress').length,
      completedProjects,
      completionRate: Math.round(completionRate),
      totalHours: timesheets.reduce((sum, ts) => sum + ts.hours, 0)
    };
  }, [projects, timesheets, timeRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Project Analytics</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalHours}h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
