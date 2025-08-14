import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare, 
  FileText,
  Users,
  Calendar,
  Filter,
  Search
} from 'lucide-react';

const RecentActivities = ({ projects, timesheets }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

  // Generate comprehensive activity feed
  const activities = useMemo(() => {
    const allActivities = [];

    // Project activities
    projects.forEach(project => {
      // Project creation
      allActivities.push({
        id: `project-${project.id}-created`,
        type: 'project_created',
        title: `Project "${project.name}" created`,
        description: `New project started for ${project.client}`,
        timestamp: new Date(project.startDate),
        user: 'System',
        priority: 'medium',
        projectId: project.id,
        projectName: project.name,
        icon: '📋'
      });

      // Stage updates
      project.stages.forEach(stage => {
        if (stage.internalApproved && stage.internalApprovedDate) {
          allActivities.push({
            id: `stage-${project.id}-${stage.name}-internal`,
            type: 'stage_approved',
            title: `Stage "${stage.name}" internally approved`,
            description: `Internal team approved ${stage.name} for ${project.name}`,
            timestamp: new Date(stage.internalApprovedDate),
            user: 'Internal Team',
            priority: 'high',
            projectId: project.id,
            projectName: project.name,
            icon: '✅'
          });
        }

        if (stage.clientApproved && stage.clientApprovedDate) {
          allActivities.push({
            id: `stage-${project.id}-${stage.name}-client`,
            type: 'stage_approved',
            title: `Stage "${stage.name}" client approved`,
            description: `Client approved ${stage.name} for ${project.name}`,
            timestamp: new Date(stage.clientApprovedDate),
            user: project.client,
            priority: 'high',
            projectId: project.id,
            projectName: project.name,
            icon: '🎉'
          });
        }

        if (stage.completedDate) {
          allActivities.push({
            id: `stage-${project.id}-${stage.name}-completed`,
            type: 'stage_completed',
            title: `Stage "${stage.name}" completed`,
            description: `${stage.name} completed for ${project.name}`,
            timestamp: new Date(stage.completedDate),
            user: 'System',
            priority: 'medium',
            projectId: project.id,
            projectName: project.name,
            icon: '🏁'
          });
        }
      });

      // Status changes
      if (project.status === 'Completed') {
        allActivities.push({
          id: `project-${project.id}-completed`,
          type: 'project_completed',
          title: `Project "${project.name}" completed`,
          description: `Project successfully delivered to ${project.client}`,
          timestamp: new Date(project.dueDate),
          user: 'System',
          priority: 'high',
          projectId: project.id,
          projectName: project.name,
          icon: '🎯'
        });
      }
    });

    // Timesheet activities
    timesheets.forEach(timesheet => {
      allActivities.push({
        id: `timesheet-${timesheet.id}`,
        type: 'timesheet_logged',
        title: `Time logged for ${timesheet.projectName}`,
        description: `${timesheet.hours}h logged on ${timesheet.description}`,
        timestamp: new Date(timesheet.date),
        user: timesheet.userName || 'Team Member',
        priority: 'low',
        projectId: timesheet.projectId,
        projectName: timesheet.projectName,
        icon: '⏰'
      });
    });

    // Mock additional activities for demonstration
    const mockActivities = [
      {
        id: 'comment-1',
        type: 'comment_added',
        title: 'New comment on Project Alpha',
        description: 'Sarah Johnson added a comment about design requirements',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        user: 'Sarah Johnson',
        priority: 'medium',
        projectId: '1',
        projectName: 'Project Alpha',
        icon: '💬'
      },
      {
        id: 'file-1',
        type: 'file_uploaded',
        title: 'Design files uploaded',
        description: 'UI mockups and wireframes uploaded to Project Beta',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        user: 'Mike Chen',
        priority: 'medium',
        projectId: '2',
        projectName: 'Project Beta',
        icon: '📁'
      },
      {
        id: 'meeting-1',
        type: 'meeting_scheduled',
        title: 'Client review meeting scheduled',
        description: 'Weekly progress review with TechCorp scheduled for tomorrow',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        user: 'Project Manager',
        priority: 'high',
        projectId: '1',
        projectName: 'Project Alpha',
        icon: '📅'
      },
      {
        id: 'milestone-1',
        type: 'milestone_reached',
        title: 'Development milestone reached',
        description: 'Backend API development completed for Project Gamma',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        user: 'System',
        priority: 'high',
        projectId: '3',
        projectName: 'Project Gamma',
        icon: '🚀'
      }
    ];

    allActivities.push(...mockActivities);

    // Sort by timestamp (most recent first)
    return allActivities.sort((a, b) => b.timestamp - a.timestamp);
  }, [projects, timesheets]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by time
    if (timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(filterDate.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(filterDate.getMonth() - 1);
          break;
        default:
          break;
      }
      
      if (timeFilter !== 'all') {
        filtered = filtered.filter(activity => activity.timestamp >= filterDate);
      }
    }

    return filtered;
  }, [activities, filterType, searchQuery, timeFilter]);

  const activityTypes = [
    { value: 'all', label: 'All Activities', icon: '📊' },
    { value: 'project_created', label: 'Projects', icon: '📋' },
    { value: 'stage_approved', label: 'Approvals', icon: '✅' },
    { value: 'stage_completed', label: 'Completions', icon: '🏁' },
    { value: 'project_completed', label: 'Deliveries', icon: '🎯' },
    { value: 'timesheet_logged', label: 'Time Tracking', icon: '⏰' },
    { value: 'comment_added', label: 'Comments', icon: '💬' },
    { value: 'file_uploaded', label: 'Files', icon: '📁' },
    { value: 'meeting_scheduled', label: 'Meetings', icon: '📅' },
    { value: 'milestone_reached', label: 'Milestones', icon: '🚀' }
  ];

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recent Activities</h2>
          <p className="text-gray-600">Track all project and system activities in real-time</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {timeFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Activity Type Filter */}
          <div className="flex-shrink-0">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`border-l-4 ${getPriorityColor(activity.priority)} bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-2xl">
                  {activity.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {getPriorityIcon(activity.priority)}
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{activity.user}</span>
                      </span>
                      
                      {activity.projectName && (
                        <span className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>{activity.projectName}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {activity.type === 'stage_approved' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Approved
                        </span>
                      )}
                      {activity.type === 'project_completed' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Completed
                        </span>
                      )}
                      {activity.type === 'milestone_reached' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Milestone
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Activity Summary */}
      {filteredActivities.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredActivities.length} of {activities.length} activities
            </span>
            <span>
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;

