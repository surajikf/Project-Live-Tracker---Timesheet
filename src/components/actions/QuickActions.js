import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings,
  Upload,
  Download,
  Calendar,
  Bell,
  Search,
  Filter,
  CheckCircle
} from 'lucide-react';

const QuickActions = ({ user, onAction }) => {
  const [showMore, setShowMore] = useState(false);

  const getActionsByRole = () => {
    const baseActions = [
      {
        id: 'search',
        name: 'Search Projects',
        description: 'Find projects quickly',
        icon: Search,
        color: 'bg-blue-500',
        action: 'search'
      },
      {
        id: 'notifications',
        name: 'Notifications',
        description: 'View updates and alerts',
        icon: Bell,
        color: 'bg-orange-500',
        action: 'notifications'
      }
    ];

    if (user?.role === 'admin') {
      return [
        ...baseActions,
        {
          id: 'new-project',
          name: 'New Project',
          description: 'Create a new project',
          icon: Plus,
          color: 'bg-primary-500',
          action: 'new-project'
        },
        {
          id: 'team-management',
          name: 'Manage Team',
          description: 'Add/remove team members',
          icon: Users,
          color: 'bg-green-500',
          action: 'team-management'
        },
        {
          id: 'reports',
          name: 'Reports',
          description: 'Generate project reports',
          icon: FileText,
          color: 'bg-purple-500',
          action: 'reports'
        },
        {
          id: 'settings',
          name: 'Settings',
          description: 'Configure system settings',
          icon: Settings,
          color: 'bg-gray-500',
          action: 'settings'
        }
      ];
    } else if (user?.role === 'team') {
      return [
        ...baseActions,
        {
          id: 'log-time',
          name: 'Log Time',
          description: 'Record work hours',
          icon: Clock,
          color: 'bg-primary-500',
          action: 'log-time'
        },
        {
          id: 'upload-files',
          name: 'Upload Files',
          description: 'Share project documents',
          icon: Upload,
          color: 'bg-green-500',
          action: 'upload-files'
        },
        {
          id: 'team-chat',
          name: 'Team Chat',
          description: 'Collaborate with team',
          icon: MessageSquare,
          color: 'bg-blue-500',
          action: 'team-chat'
        },
        {
          id: 'calendar',
          name: 'Calendar',
          description: 'View project timeline',
          icon: Calendar,
          color: 'bg-orange-500',
          action: 'calendar'
        }
      ];
    } else if (user?.role === 'client') {
      return [
        ...baseActions,
        {
          id: 'download-files',
          name: 'Download Files',
          description: 'Get project documents',
          icon: Download,
          color: 'bg-primary-500',
          action: 'download-files'
        },
        {
          id: 'approve-stages',
          name: 'Approve Stages',
          description: 'Review and approve work',
          icon: CheckCircle,
          color: 'bg-green-500',
          action: 'approve-stages'
        },
        {
          id: 'project-updates',
          name: 'Project Updates',
          description: 'Get latest progress',
          icon: FileText,
          color: 'bg-blue-500',
          action: 'project-updates'
        }
      ];
    }

    return baseActions;
  };

  const actions = getActionsByRole();
  const visibleActions = showMore ? actions : actions.slice(0, 6);

  const handleAction = (action) => {
    if (onAction) {
      onAction(action);
    }
    // Default actions
    switch (action) {
      case 'search':
        // Focus search input
        document.querySelector('input[placeholder*="search" i]')?.focus();
        break;
      case 'notifications':
        // Show notifications panel
        break;
      case 'new-project':
        // Navigate to new project form
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        <span className="text-sm text-gray-500">
          {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Tools` : 'Quick Access'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.action)}
              className="group p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-left"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-primary-700">
                {action.name}
              </h4>
              <p className="text-xs text-gray-500 group-hover:text-primary-600">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>

      {actions.length > 6 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center space-x-2 mx-auto"
          >
            <span>{showMore ? 'Show Less' : `Show ${actions.length - 6} More`}</span>
            <Filter className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

      {/* Process Tips */}
      <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <h4 className="font-medium text-primary-900 mb-2">💡 Process Tips</h4>
        <div className="text-sm text-primary-700 space-y-1">
          {user?.role === 'admin' && (
            <>
              <p>• Create projects with clear stage definitions</p>
              <p>• Assign team members based on skills and availability</p>
              <p>• Monitor progress and address bottlenecks early</p>
            </>
          )}
          {user?.role === 'team' && (
            <>
              <p>• Log time daily for accurate tracking</p>
              <p>• Update stage progress regularly</p>
              <p>• Communicate with team members proactively</p>
            </>
          )}
          {user?.role === 'client' && (
            <>
              <p>• Review and approve stages promptly</p>
              <p>• Provide clear feedback for revisions</p>
              <p>• Stay updated on project progress</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
