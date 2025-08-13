import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateStageApproval } from '../../store/slices/projectsSlice';
import { 
  CheckCircle, 
  Clock, 
  FileText,
  Download,
  Upload
} from 'lucide-react';

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector(state => state.projects);

  // Filter projects for current client (in real app, this would be based on client ID)
  const clientProjects = projects.filter(project => 
    project.client.toLowerCase().includes('client') || 
    project.client.toLowerCase().includes('inc') ||
    project.client.toLowerCase().includes('xyz')
  );

  const handleClientApproval = (projectId, stageId, approved) => {
    dispatch(updateStageApproval({ 
      projectId, 
      stageId, 
      approvalType: 'client', 
      approved 
    }));
  };

  const getPendingApprovals = () => {
    return clientProjects.flatMap(project => 
      project.stages
        .filter(stage => !stage.clientApproved)
        .map(stage => ({
          ...stage,
          projectName: project.name,
          projectId: project.id
        }))
    );
  };

  const pendingApprovals = getPendingApprovals();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-900 mb-2">
            Welcome to Your Project Dashboard
          </h2>
          <p className="text-primary-700">
            Track the progress of your projects and approve completed stages
          </p>
        </div>
      </div>

      {/* My Projects Overview */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">My Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{project.name}</h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'in_progress' ? 'bg-success-100 text-success-800' :
                  project.status === 'on_hold' ? 'bg-danger-100 text-danger-800' :
                  'bg-warning-100 text-warning-800'
                }`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <p>Started: {new Date(project.startDate).toLocaleDateString()}</p>
                <p>Due: {new Date(project.dueDate).toLocaleDateString()}</p>
              </div>

              <Link
                to={`/projects/${project.id}`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Your Approval</h3>
        {pendingApprovals.length > 0 ? (
          <div className="space-y-4">
            {pendingApprovals.map((stage, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{stage.name}</h4>
                    <p className="text-sm text-gray-500">{stage.projectName}</p>
                    <p className="text-sm text-gray-500">Assigned to: {stage.assignedTo}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                      {stage.weightage}% Weightage
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleClientApproval(stage.projectId, stage.id, true)}
                    className="btn-success text-sm py-2 px-4"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleClientApproval(stage.projectId, stage.id, false)}
                    className="btn-danger text-sm py-2 px-4"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-success-400 mx-auto mb-3" />
            <p className="text-gray-500">No pending approvals at the moment!</p>
            <p className="text-sm text-gray-400">All stages are either approved or in progress.</p>
          </div>
        )}
      </div>

      {/* Project Timeline */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Timeline</h3>
        <div className="space-y-4">
          {clientProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{project.name}</h4>
              <div className="space-y-2">
                {project.stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      stage.ikfApproved && stage.clientApproved ? 'bg-success-500' :
                      stage.ikfApproved || stage.clientApproved ? 'bg-warning-500' :
                      'bg-gray-300'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{stage.name}</p>
                      <p className="text-xs text-gray-500">
                        {stage.assignedTo} • {stage.weightage}% • 
                        {stage.dateStarted ? ` Started: ${new Date(stage.dateStarted).toLocaleDateString()}` : ' Not started'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {stage.ikfApproved && (
                        <span className="text-xs text-success-600 bg-success-100 px-2 py-1 rounded">
                          IKF Approved
                        </span>
                      )}
                      {stage.clientApproved && (
                        <span className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded">
                          Client Approved
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Download className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Download Files</p>
              <p className="text-sm text-gray-500">Access project documents</p>
            </div>
          </div>

          <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Upload className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Upload Feedback</p>
              <p className="text-sm text-gray-500">Share your comments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Total Projects</h4>
          <p className="text-3xl font-bold text-primary-600">{clientProjects.length}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-warning-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Pending Approvals</h4>
          <p className="text-3xl font-bold text-warning-600">{pendingApprovals.length}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-success-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Average Progress</h4>
          <p className="text-3xl font-bold text-success-600">
            {clientProjects.length > 0 
              ? Math.round(clientProjects.reduce((sum, p) => sum + p.progress, 0) / clientProjects.length)
              : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
