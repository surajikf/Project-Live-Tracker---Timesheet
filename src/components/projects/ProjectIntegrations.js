import React, { useState } from 'react';
import { 
  Zap, 
  Link, 
  Settings, 
  Plus, 
  Trash2, 
  Play, 
  Pause,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Code,
  Database,
  Cloud,
  MessageSquare,
  Calendar,
  FileText,
  BarChart3
} from 'lucide-react';

const ProjectIntegrations = ({ project }) => {
  const [activeTab, setActiveTab] = useState('connected');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  // Mock integrations data
  const [integrations] = useState({
    connected: [
      {
        id: 1,
        name: 'GitHub',
        type: 'version-control',
        status: 'connected',
        lastSync: '2 minutes ago',
        icon: Code,
        description: 'Source code repository and version control',
        features: ['Code sync', 'Pull requests', 'Issues', 'Actions']
      },
      {
        id: 2,
        name: 'Slack',
        type: 'communication',
        status: 'connected',
        lastSync: '5 minutes ago',
        icon: MessageSquare,
        description: 'Team communication and notifications',
        features: ['Channel sync', 'Notifications', 'Bot integration']
      },
      {
        id: 3,
        name: 'Jira',
        type: 'project-management',
        status: 'connected',
        lastSync: '1 hour ago',
        icon: BarChart3,
        description: 'Issue tracking and project management',
        features: ['Issue sync', 'Workflow automation', 'Time tracking']
      },
      {
        id: 4,
        name: 'AWS S3',
        type: 'storage',
        status: 'connected',
        lastSync: '30 minutes ago',
        icon: Cloud,
        description: 'Cloud storage and file management',
        features: ['File sync', 'Backup', 'CDN integration']
      }
    ],
    available: [
      {
        id: 5,
        name: 'Trello',
        type: 'project-management',
        icon: BarChart3,
        description: 'Visual project management with boards',
        features: ['Board sync', 'Card management', 'Team collaboration']
      },
      {
        id: 6,
        name: 'Discord',
        type: 'communication',
        icon: MessageSquare,
        description: 'Voice and text communication platform',
        features: ['Server sync', 'Voice channels', 'Bot integration']
      },
      {
        id: 7,
        name: 'MongoDB',
        type: 'database',
        icon: Database,
        description: 'NoSQL database integration',
        features: ['Data sync', 'Real-time updates', 'Backup']
      },
      {
        id: 8,
        name: 'Google Calendar',
        type: 'calendar',
        icon: Calendar,
        description: 'Calendar and scheduling integration',
        features: ['Event sync', 'Meeting scheduling', 'Reminders']
      }
    ]
  });

  const [automations] = useState([
    {
      id: 1,
      name: 'Auto-deploy on merge',
      description: 'Automatically deploy to staging when code is merged to main branch',
      trigger: 'GitHub merge',
      action: 'Deploy to staging',
      status: 'active',
      lastRun: '2 hours ago',
      runs: 45
    },
    {
      id: 2,
      name: 'Slack notifications',
      description: 'Send notifications to Slack channel for project updates',
      trigger: 'Project status change',
      action: 'Slack message',
      status: 'active',
      lastRun: '1 hour ago',
      runs: 128
    },
    {
        id: 3,
        name: 'Daily backup',
        description: 'Create daily backup of project files and database',
        trigger: 'Daily at 2 AM',
        action: 'Backup to S3',
        status: 'paused',
        lastRun: '1 day ago',
        runs: 89
    }
  ]);

  const serviceTypes = [
    { value: 'version-control', label: 'Version Control', icon: Code },
    { value: 'communication', label: 'Communication', icon: MessageSquare },
    { value: 'project-management', label: 'Project Management', icon: BarChart3 },
    { value: 'storage', label: 'Storage', icon: Cloud },
    { value: 'database', label: 'Database', icon: Database },
    { value: 'calendar', label: 'Calendar', icon: Calendar }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'disconnected':
        return <AlertTriangle className="w-4 h-4" />;
      case 'pending':
      case 'paused':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleConnect = (integration) => {
    // Connect logic here
    console.log(`Connecting to ${integration.name}`);
    setShowAddModal(false);
  };

  const handleDisconnect = (integration) => {
    // Disconnect logic here
    console.log(`Disconnecting from ${integration.name}`);
  };

  const handleToggleAutomation = (automation) => {
    // Toggle automation logic here
    console.log(`Toggling automation: ${automation.name}`);
  };

  const tabs = [
    { id: 'connected', label: 'Connected Services', icon: Link, count: integrations.connected.length },
    { id: 'available', label: 'Available Services', icon: Plus, count: integrations.available.length },
    { id: 'automations', label: 'Automations', icon: Zap, count: automations.length }
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Integrations</h3>
          <p className="text-gray-600">Connect third-party services and automate workflows</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-50 rounded-lg p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Connected Services Tab */}
      {activeTab === 'connected' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.connected.map((integration) => {
              const Icon = integration.icon;
              return (
                <div key={integration.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                        {getStatusIcon(integration.status)}
                        <span className="ml-1">{integration.status}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Last synced: {integration.lastSync}</p>
                    <div className="flex flex-wrap gap-2">
                      {integration.features.map((feature, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      <Settings className="w-4 h-4 inline mr-1" />
                      Configure
                    </button>
                    <button
                      onClick={() => handleDisconnect(integration)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Disconnect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Services Tab */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.available.map((integration) => {
              const Icon = integration.icon;
              return (
                <div key={integration.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {integration.features.map((feature, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleConnect(integration)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Connect Service
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Automations Tab */}
      {activeTab === 'automations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">Workflow Automations</h4>
              <p className="text-sm text-gray-600">Automate repetitive tasks and workflows</p>
            </div>
            <div className="divide-y divide-gray-200">
              {automations.map((automation) => (
                <div key={automation.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h5 className="text-sm font-medium text-gray-900">{automation.name}</h5>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(automation.status)}`}>
                          {getStatusIcon(automation.status)}
                          <span className="ml-1">{automation.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{automation.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Trigger: {automation.trigger}</span>
                        <span>Action: {automation.action}</span>
                        <span>Last run: {automation.lastRun}</span>
                        <span>{automation.runs} total runs</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleAutomation(automation)}
                        className={`p-2 rounded-md ${
                          automation.status === 'active' 
                            ? 'text-yellow-600 hover:text-yellow-700' 
                            : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        {automation.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Integration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type:</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.map(service => (
                      <option key={service.value} value={service.value}>{service.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Select a service type to see available integrations and configuration options.</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  disabled={!selectedService}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectIntegrations;
