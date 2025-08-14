import React, { useState, useMemo } from 'react';
import { Clock, MessageSquare, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const RecentActivities = ({ projects, timesheets }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activities = useMemo(() => {
    const allActivities = [];

    // Project activities
    projects.forEach(project => {
      allActivities.push({
        id: `project-${project.id}`,
        type: 'project',
        title: `Project "${project.name}" created`,
        description: `New project started with status: ${project.status}`,
        timestamp: new Date(project.startDate),
        priority: 'medium'
      });
    });

    // Timesheet activities
    timesheets.forEach(timesheet => {
      allActivities.push({
        id: `timesheet-${timesheet.id}`,
        type: 'timesheet',
        title: `Time logged`,
        description: `${timesheet.hours}h logged on ${timesheet.date}`,
        timestamp: new Date(timesheet.date),
        priority: 'low'
      });
    });

    // Mock additional activities
    const mockActivities = [
      {
        id: 'milestone-1',
        type: 'milestone',
        title: 'Design Phase Completed',
        description: 'Project milestone reached successfully',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: 'high'
      },
      {
        id: 'comment-1',
        type: 'comment',
        title: 'New comment added',
        description: 'Team member left feedback on project',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        priority: 'medium'
      }
    ];

    allActivities.push(...mockActivities);
    return allActivities.sort((a, b) => b.timestamp - a.timestamp);
  }, [projects, timesheets]);

  const filteredActivities = activities.filter(activity => {
    if (filterType !== 'all' && activity.type !== filterType) return false;
    if (searchQuery && !activity.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'project': return <CheckCircle className="w-4 h-4" />;
      case 'timesheet': return <Clock className="w-4 h-4" />;
      case 'milestone': return <AlertTriangle className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Activities</option>
            <option value="project">Projects</option>
            <option value="timesheet">Timesheets</option>
            <option value="milestone">Milestones</option>
            <option value="comment">Comments</option>
          </select>
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredActivities.slice(0, 10).map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                      {activity.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
