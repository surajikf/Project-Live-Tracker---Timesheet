import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Settings, 
  Eye, 
  EyeOff, 
  Send, 
  Paperclip,
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  FileText,
  MessageSquare,
  BarChart3,
  Download,
  Upload,
  Share2,
  Lock,
  Unlock,
  Star,
  Flag,
  Bookmark,
  History,
  Zap,
  TrendingUp,
  PieChart,
  Activity
} from 'lucide-react';
import ProcessWorkflow from '../workflow/ProcessWorkflow';
import ProjectTimeline from './ProjectTimeline';
import ProjectBudget from './ProjectBudget';
import ProjectReports from './ProjectReports';
import ProjectIntegrations from './ProjectIntegrations';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.users);

  const project = projects.find(p => p.id === projectId);

  // State variables
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddStage, setShowAddStage] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  
  const [newComment, setNewComment] = useState('');
  const [newStage, setNewStage] = useState({ name: '', description: '', weightage: 0 });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban

  // Mock data
  const [comments] = useState([
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: 'SJ',
      content: 'The design mockups look great! Can we add more interactive elements?',
      timestamp: '2 hours ago',
      attachments: ['design-mockup-v2.pdf'],
      projectId: projectId,
      type: 'feedback'
    },
    {
      id: 2,
      user: 'Mike Chen',
      avatar: 'MC',
      content: 'Development is progressing well. Backend API is 80% complete.',
      timestamp: '4 hours ago',
      attachments: [],
      projectId: projectId,
      type: 'update'
    },
    {
      id: 3,
      user: 'Client POC',
      avatar: 'CP',
      content: 'Looking forward to seeing the final result. Keep up the good work!',
      timestamp: '1 day ago',
      attachments: [],
      projectId: projectId,
      type: 'approval'
    }
  ]);

  const [files] = useState([
    {
      id: 1,
      name: 'design-mockup-v1.pdf',
      size: '2.4 MB',
      type: 'pdf',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-15',
      version: '1.0',
      category: 'Design'
    },
    {
      id: 2,
      name: 'technical-specs.docx',
      size: '1.8 MB',
      type: 'docx',
      uploadedBy: 'Mike Chen',
      uploadedAt: '2024-01-14',
      version: '2.1',
      category: 'Documentation'
    },
    {
      id: 3,
      name: 'project-timeline.xlsx',
      size: '856 KB',
      type: 'xlsx',
      uploadedBy: 'Project Manager',
      uploadedAt: '2024-01-13',
      version: '1.0',
      category: 'Planning'
    }
  ]);

  const [teamMembers] = useState([
    { id: 1, name: 'Sarah Johnson', role: 'UI/UX Designer', department: 'Design', avatar: 'SJ', status: 'active' },
    { id: 2, name: 'Mike Chen', role: 'Full Stack Developer', department: 'Development', avatar: 'MC', status: 'active' },
    { id: 3, name: 'Alex Rodriguez', role: 'QA Engineer', department: 'Testing', avatar: 'AR', status: 'active' },
    { id: 4, name: 'Emma Wilson', role: 'Project Manager', department: 'Management', avatar: 'EW', status: 'active' }
  ]);

  const [projectMetrics] = useState({
    budget: { allocated: 50000, spent: 32000, remaining: 18000 },
    timeline: { planned: 90, actual: 45, remaining: 45 },
    quality: { score: 92, issues: 3, resolved: 12 },
    efficiency: { plannedHours: 400, actualHours: 280, variance: -30 }
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'workflow', label: 'Workflow', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'settings', icon: Settings }
  ];

  useEffect(() => {
    if (!project) {
      navigate('/projects');
    }
  }, [project, navigate]);

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
      setShowAddComment(false);
    }
  };

  const handleFileUpload = () => {
    // File upload logic here
    setShowFileUpload(false);
  };

  const handleAddStage = () => {
    if (newStage.name && newStage.description) {
      // Add stage logic here
      setNewStage({ name: '', description: '', weightage: 0 });
      setShowAddStage(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Project Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/projects')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ← Back to Projects
                </button>
                <div className="h-8 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                  <p className="text-sm text-gray-600">Client: {project.client}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority || 'Medium')}`}>
                  {project.priority || 'Medium'}
                </span>
                {user.role === 'admin' && (
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
                )}
              </div>
            </div>

            {/* Project Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Project Progress</span>
                <span>{project.progress}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Budget</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${projectMetrics.budget.spent.toLocaleString()} / ${projectMetrics.budget.allocated.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Timeline</p>
                <p className="text-lg font-semibold text-gray-900">
                  {projectMetrics.timeline.actual} / {projectMetrics.timeline.planned} days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Quality Score</p>
                <p className="text-lg font-semibold text-gray-900">
                  {projectMetrics.quality.score}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Efficiency</p>
                <p className="text-lg font-semibold text-gray-900">
                  {projectMetrics.efficiency.variance}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Project Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Summary</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Start Date:</span>
                        <span className="ml-2 text-gray-600">{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Due Date:</span>
                        <span className="ml-2 text-gray-600">{new Date(project.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Client:</span>
                        <span className="ml-2 text-gray-600">{project.client}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Priority:</span>
                        <span className="ml-2 text-gray-600">{project.priority || 'Medium'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                      {comments.slice(0, 3).map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {comment.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                              <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-600">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        📝 Add Comment
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        📁 Upload Files
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        👥 Manage Team
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        📊 View Reports
                      </button>
                    </div>
                  </div>

                  {/* Project Health */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Health</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Timeline</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          projectMetrics.timeline.actual <= projectMetrics.timeline.planned * 0.8 ? 'bg-green-100 text-green-800' :
                          projectMetrics.timeline.actual <= projectMetrics.timeline.planned ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {projectMetrics.timeline.actual <= projectMetrics.timeline.planned * 0.8 ? 'On Track' :
                           projectMetrics.timeline.actual <= projectMetrics.timeline.planned ? 'At Risk' : 'Behind'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Budget</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          projectMetrics.budget.spent <= projectMetrics.budget.allocated * 0.8 ? 'bg-green-100 text-green-800' :
                          projectMetrics.budget.spent <= projectMetrics.budget.allocated ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {projectMetrics.budget.spent <= projectMetrics.budget.allocated * 0.8 ? 'Under Budget' :
                           projectMetrics.budget.spent <= projectMetrics.budget.allocated ? 'On Budget' : 'Over Budget'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Quality</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          projectMetrics.quality.score >= 90 ? 'bg-green-100 text-green-800' :
                          projectMetrics.quality.score >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {projectMetrics.quality.score >= 90 ? 'Excellent' :
                           projectMetrics.quality.score >= 80 ? 'Good' : 'Needs Attention'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Workflow Tab */}
            {activeTab === 'workflow' && (
              <ProcessWorkflow project={project} />
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <ProjectTimeline project={project} />
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Project Team</h3>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => setShowTeamModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Team
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg font-medium text-blue-600">
                          {member.avatar}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">
                        Department: {member.department}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-xs">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Project Files</h3>
                  <button
                    onClick={() => setShowFileUpload(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </button>
                </div>

                {/* File Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Design">Design</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Planning">Planning</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="size">Sort by Size</option>
                  </select>
                </div>

                {/* Files Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file) => (
                    <div key={file.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">{file.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{file.size} • {file.type.toUpperCase()}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{file.uploadedBy}</span>
                        <span>{file.uploadedAt}</span>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {file.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Project Comments</h3>
                  <button
                    onClick={() => setShowAddComment(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Comment
                  </button>
                </div>

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                          {comment.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              comment.type === 'feedback' ? 'bg-yellow-100 text-yellow-800' :
                              comment.type === 'update' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {comment.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{comment.content}</p>
                          {comment.attachments.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <Paperclip className="w-4 h-4 text-gray-400" />
                              {comment.attachments.map((attachment, index) => (
                                <span key={index} className="text-xs text-blue-600 hover:underline cursor-pointer">
                                  {attachment}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Tab */}
            {activeTab === 'budget' && (
              <ProjectBudget project={project} projectMetrics={projectMetrics} />
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <ProjectReports project={project} />
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <ProjectIntegrations project={project} />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Project Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Basic Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input
                          type="text"
                          defaultValue={project.name}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          defaultValue={project.description}
                          rows={3}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Project Details</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          defaultValue={project.status}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Planning">Planning</option>
                          <option value="In Progress">In Progress</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                          defaultValue={project.priority || 'Medium'}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Add Comment Modal */}
      {showAddComment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Comment</h3>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowAddComment(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {showFileUpload && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Drop files here or click to select</p>
                <input type="file" multiple className="hidden" />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowFileUpload(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Management Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Team</h3>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {member.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{member.name}</span>
                    </div>
                    <button className="text-red-600 hover:text-red-800 text-sm">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowTeamModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
