import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateStageApproval } from '../../store/slices/projectsSlice';
import ProcessWorkflow from '../workflow/ProcessWorkflow';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  Upload,
  MessageSquare,
  Calendar,
  User,
  AlertCircle,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Users,
  Settings,
  Eye,
  EyeOff,
  Send,
  Paperclip
} from 'lucide-react';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects } = useSelector(state => state.projects);
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStage, setSelectedStage] = useState(null);
  const [showAddStage, setShowAddStage] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newStage, setNewStage] = useState({
    name: '',
    assignedTo: '',
    assignedRole: '',
    weightage: 0,
    notes: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'John Doe',
      role: 'admin',
      message: 'Project kickoff meeting scheduled for tomorrow',
      timestamp: new Date(Date.now() - 86400000),
      attachments: []
    }
  ]);

  const project = projects.find(p => p.id === parseInt(projectId));

  useEffect(() => {
    if (!project) {
      navigate('/dashboard');
    }
  }, [project, navigate]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const handleApproval = (stageId, approvalType, approved) => {
    dispatch(updateStageApproval({ 
      projectId: project.id, 
      stageId, 
      approvalType, 
      approved 
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
        return 'bg-success-100 text-success-800';
      case 'on_hold':
        return 'bg-danger-100 text-danger-800';
      case 'completed':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_progress':
        return <Play className="w-4 h-4" />;
      case 'on_hold':
        return <Pause className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'workflow', name: 'Workflow', icon: Play },
    { id: 'stages', name: 'Stages', icon: CheckCircle },
    { id: 'files', name: 'Files', icon: Download },
    { id: 'comments', name: 'Comments', icon: MessageSquare },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">Client: {project.client}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span className="ml-1 capitalize">
              {project.status.replace('_', ' ')}
            </span>
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900">Project Progress</h3>
            <span className="text-2xl font-bold text-primary-600">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium text-gray-900">{new Date(project.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="font-medium text-gray-900">{new Date(project.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Days Remaining</p>
            <p className="font-medium text-gray-900">
              {Math.max(0, Math.ceil((new Date(project.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Project Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium">{project.status.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Client:</span>
                      <span className="font-medium">{project.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Due Date:</span>
                      <span className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Stages:</span>
                      <span className="font-medium">{project.stages.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Completed Stages:</span>
                      <span className="font-medium">
                        {project.stages.filter(s => s.ikfApproved && s.clientApproved).length}
                      </span>
                    </div>
                    <div className="flex-between">
                      <span className="text-gray-500">Pending Approvals:</span>
                      <span className="font-medium">
                        {project.stages.filter(s => !s.ikfApproved || !s.clientApproved).length}
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

          {/* Stages Tab */}
          {activeTab === 'stages' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900">Project Stages</h4>
                <button 
                  onClick={() => setShowAddStage(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stage
                </button>
              </div>
              
              {project.stages.map((stage) => (
                <div key={stage.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{stage.name}</h4>
                      <p className="text-sm text-gray-500">Assigned to: {stage.assignedTo}</p>
                      <p className="text-sm text-gray-500">Role: {stage.assignedRole}</p>
                      <p className="text-sm text-gray-500">Weightage: {stage.weightage}%</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {stage.ikfApproved && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          IKF Approved
                        </span>
                      )}
                      {stage.clientApproved && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Client Approved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Date Started</p>
                      <p className="text-sm font-medium">
                        {stage.dateStarted ? new Date(stage.dateStarted).toLocaleDateString() : 'Not started'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date Completed</p>
                      <p className="text-sm font-medium">
                        {stage.dateCompleted ? new Date(stage.dateCompleted).toLocaleDateString() : 'Not completed'}
                      </p>
                    </div>
                  </div>

                  {stage.notes && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{stage.notes}</p>
                    </div>
                  )}

                  {/* Approval Actions */}
                  <div className="flex items-center space-x-3">
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleApproval(stage.id, 'ikf', !stage.ikfApproved)}
                        className={`btn-${stage.ikfApproved ? 'secondary' : 'success'} text-sm py-2 px-4`}
                      >
                        {stage.ikfApproved ? 'Revoke IKF Approval' : 'Approve IKF'}
                      </button>
                    )}
                    
                    {user?.role === 'client' && (
                      <button
                        onClick={() => handleApproval(stage.id, 'client', !stage.clientApproved)}
                        className={`btn-${stage.clientApproved ? 'secondary' : 'success'} text-sm py-2 px-4`}
                      >
                        {stage.clientApproved ? 'Revoke Client Approval' : 'Approve Client'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900">Project Files</h4>
                <button 
                  onClick={() => setShowFileUpload(true)}
                  className="btn-primary"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </button>
              </div>
              
              {uploadedFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">{file.size}</p>
                        </div>
                        <button className="text-primary-600 hover:text-primary-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Download className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No files uploaded yet</p>
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900">Project Comments</h4>
                <button 
                  onClick={() => setShowAddComment(true)}
                  className="btn-primary"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Comment
                </button>
              </div>
              
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {comment.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{comment.user}</span>
                          <span className="text-sm text-gray-500">{comment.role}</span>
                          <span className="text-sm text-gray-400">
                            {comment.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.message}</p>
                        {comment.attachments.length > 0 && (
                          <div className="mt-2 flex space-x-2">
                            {comment.attachments.map((file, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                                <Paperclip className="w-3 h-3 mr-1" />
                                {file}
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
          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900">Project Team</h4>
                <button 
                  onClick={() => setShowTeamModal(true)}
                  className="btn-primary"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Team
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.team?.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                        <p className="text-sm text-gray-400">{member.department}</p>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 col-span-full">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No team members assigned yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Project Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Project Status</p>
                      <p className="text-sm text-gray-500">Change project status</p>
                    </div>
                    <select className="input-field">
                      <option value="in_progress">In Progress</option>
                      <option value="on_hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Due Date</p>
                      <p className="text-sm text-gray-500">Update project deadline</p>
                    </div>
                    <input type="date" className="input-field" defaultValue={project.dueDate.split('T')[0]} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Client</p>
                      <p className="text-sm text-gray-500">Update client information</p>
                    </div>
                    <input type="text" className="input-field" defaultValue={project.client} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Comment</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="input-field w-full h-24 mb-4"
              placeholder="Enter your comment..."
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (newComment.trim()) {
                    setComments([...comments, {
                      id: comments.length + 1,
                      user: user?.name || 'User',
                      role: user?.role || 'user',
                      message: newComment,
                      timestamp: new Date(),
                      attachments: []
                    }]);
                    setNewComment('');
                  }
                  setShowAddComment(false);
                }}
                className="btn-primary flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </button>
              <button
                onClick={() => setShowAddComment(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showFileUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Drag and drop files here or click to browse</p>
              <button className="btn-primary mt-3">
                Browse Files
              </button>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowFileUpload(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Stage</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Stage Name"
                value={newStage.name}
                onChange={(e) => setNewStage({...newStage, name: e.target.value})}
                className="input-field w-full"
              />
              <input
                type="text"
                placeholder="Assigned To"
                value={newStage.assignedTo}
                onChange={(e) => setNewStage({...newStage, assignedTo: e.target.value})}
                className="input-field w-full"
              />
              <input
                type="text"
                placeholder="Assigned Role"
                value={newStage.assignedRole}
                onChange={(e) => setNewStage({...newStage, assignedRole: e.target.value})}
                className="input-field w-full"
              />
              <input
                type="number"
                placeholder="Weightage (%)"
                value={newStage.weightage}
                onChange={(e) => setNewStage({...newStage, weightage: parseInt(e.target.value)})}
                className="input-field w-full"
              />
              <textarea
                placeholder="Notes"
                value={newStage.notes}
                onChange={(e) => setNewStage({...newStage, notes: e.target.value})}
                className="input-field w-full h-20"
              />
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {
                  // Add stage logic would go here
                  setShowAddStage(false);
                  setNewStage({name: '', assignedTo: '', assignedRole: '', weightage: 0, notes: ''});
                }}
                className="btn-primary flex-1"
              >
                Add Stage
              </button>
              <button
                onClick={() => setShowAddStage(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Team</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Search team members..."
                  className="input-field flex-1"
                />
                <button className="btn-primary">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {/* Team member list would go here */}
                <p className="text-gray-500 text-center py-4">Team management functionality</p>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowTeamModal(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
