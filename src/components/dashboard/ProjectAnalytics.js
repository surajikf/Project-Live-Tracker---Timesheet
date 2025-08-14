import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Users, 
  Target,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ProjectAnalytics = ({ projects, timesheets }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [viewType, setViewType] = useState('overview');

  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    const getDateRange = () => {
      switch (timeRange) {
        case 'month': return monthAgo;
        case 'quarter': return quarterAgo;
        case 'year': return yearAgo;
        default: return monthAgo;
      }
    };

    const startDate = getDateRange();
    
    const filteredProjects = projects.filter(project => 
      new Date(project.startDate) >= startDate
    );

    const filteredTimesheets = timesheets.filter(ts => 
      new Date(ts.date) >= startDate
    );

    // Project completion rate
    const completedProjects = filteredProjects.filter(p => p.status === 'Completed').length;
    const completionRate = filteredProjects.length > 0 ? 
      (completedProjects / filteredProjects.length) * 100 : 0;

    // Average project duration
    const projectDurations = filteredProjects.map(project => {
      const start = new Date(project.startDate);
      const end = new Date(project.dueDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    });
    const avgDuration = projectDurations.length > 0 ? 
      projectDurations.reduce((a, b) => a + b, 0) / projectDurations.length : 0;

    // Time tracking efficiency
    const totalTrackedHours = filteredTimesheets.reduce((sum, ts) => sum + ts.hours, 0);
    const estimatedHours = filteredProjects.reduce((sum, project) => sum + (project.estimatedHours || 0), 0);
    const timeEfficiency = estimatedHours > 0 ? 
      ((estimatedHours - totalTrackedHours) / estimatedHours) * 100 : 0;

    // Stage completion analysis
    const stageStats = {};
    filteredProjects.forEach(project => {
      project.stages.forEach(stage => {
        if (!stageStats[stage.name]) {
          stageStats[stage.name] = { total: 0, completed: 0, avgTime: 0 };
        }
        stageStats[stage.name].total++;
        if (stage.internalApproved && stage.clientApproved) {
          stageStats[stage.name].completed++;
        }
      });
    });

    // Client satisfaction (based on approval speed)
    const clientApprovalTimes = filteredProjects.map(project => {
      const approvalStages = project.stages.filter(stage => 
        stage.internalApproved && stage.clientApproved
      );
      return approvalStages.map(stage => {
        const internalDate = new Date(stage.internalApprovedDate || stage.completedDate);
        const clientDate = new Date(stage.clientApprovedDate || stage.completedDate);
        return Math.ceil((clientDate - internalDate) / (1000 * 60 * 60 * 24));
      });
    }).flat();
    
    const avgClientApprovalTime = clientApprovalTimes.length > 0 ? 
      clientApprovalTimes.reduce((a, b) => a + b, 0) / clientApprovalTimes.length : 0;

    return {
      totalProjects: filteredProjects.length,
      completedProjects,
      completionRate,
      avgDuration: Math.round(avgDuration),
      totalHours: totalTrackedHours,
      timeEfficiency: Math.round(timeEfficiency),
      stageStats,
      avgClientApprovalTime: Math.round(avgClientApprovalTime),
      projectsByStatus: {
        'In Progress': filteredProjects.filter(p => p.status === 'In Progress').length,
        'On Hold': filteredProjects.filter(p => p.status === 'On Hold').length,
        'Completed': completedProjects,
        'Planning': filteredProjects.filter(p => p.status === 'Planning').length
      },
      projectsByClient: filteredProjects.reduce((acc, project) => {
        acc[project.client] = (acc[project.client] || 0) + 1;
        return acc;
      }, {}),
      monthlyProgress: filteredProjects.reduce((acc, project) => {
        const month = new Date(project.startDate).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {})
    };
  }, [projects, timesheets, timeRange]);

  const viewTypes = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'stages', label: 'Stage Analysis', icon: Target }
  ];

  const timeRanges = [
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into project performance and trends</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Key Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analytics.completionRate.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analytics.completionRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {analytics.completedProjects} of {analytics.totalProjects} projects completed
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Time Efficiency</h3>
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analytics.timeEfficiency.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">
              {analytics.totalHours}h tracked vs {analytics.totalHours + Math.round(analytics.totalHours * (analytics.timeEfficiency / 100))}h estimated
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Client Response</h3>
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {analytics.avgClientApprovalTime} days
            </div>
            <p className="text-sm text-gray-600">
              Average client approval time
            </p>
          </div>

          {/* Project Status Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Distribution</h3>
            <div className="space-y-3">
              {Object.entries(analytics.projectsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{status}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status === 'Completed' ? 'bg-green-500' :
                          status === 'In Progress' ? 'bg-blue-500' :
                          status === 'On Hold' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${(count / analytics.totalProjects) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress</h3>
            <div className="space-y-2">
              {Object.entries(analytics.monthlyProgress).map(([month, count]) => (
                <div key={month} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{month}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance View */}
      {viewType === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Duration Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Duration</span>
                  <span className="text-lg font-semibold text-gray-900">{analytics.avgDuration} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fastest Project</span>
                  <span className="text-sm font-semibold text-green-600">
                    {Math.min(...projects.map(p => {
                      const start = new Date(p.startDate);
                      const end = new Date(p.dueDate);
                      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                    }))} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Longest Project</span>
                  <span className="text-sm font-semibold text-red-600">
                    {Math.max(...projects.map(p => {
                      const start = new Date(p.startDate);
                      const end = new Date(p.dueDate);
                      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                    }))} days
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Performance</h3>
              <div className="space-y-3">
                {Object.entries(analytics.projectsByClient).map(([client, count]) => (
                  <div key={client} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 truncate">{client}</span>
                    <span className="text-sm font-semibold text-gray-900">{count} projects</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewType === 'timeline' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline Analysis</h3>
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => {
              const start = new Date(project.startDate);
              const end = new Date(project.dueDate);
              const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
              const progress = project.progress;
              
              return (
                <div key={project.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {start.toLocaleDateString()} - {end.toLocaleDateString()} ({duration} days)
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {progress}% complete
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stage Analysis View */}
      {viewType === 'stages' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stage Completion Analysis</h3>
          <div className="space-y-4">
            {Object.entries(analytics.stageStats).map(([stageName, stats]) => {
              const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
              
              return (
                <div key={stageName} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">{stageName}</h4>
                    <span className="text-sm text-gray-600">
                      {stats.completed}/{stats.total} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Completion Rate: {completionRate.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAnalytics;

