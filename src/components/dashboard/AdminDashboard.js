import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateProjectStatus } from '../../store/slices/projectsSlice';
import { 
  Eye, 
  Play, 
  Pause, 
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector(state => state.projects);
  const { users } = useSelector(state => state.users);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleStatusChange = (projectId, newStatus) => {
    dispatch(updateProjectStatus({ projectId, status: newStatus }));
  };

  const filteredProjects = selectedStatus === 'all' 
    ? projects 
    : projects.filter(p => p.status === selectedStatus);

  // Calculate pending approvals
  const pendingApprovals = projects.reduce((total, project) => {
    return total + project.stages.filter(s => !s.ikfApproved || !s.clientApproved).length;
  }, 0);

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
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Project Overview</h3>
          <div className="flex space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field text-sm"
            >
              <option value="all">All Projects</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {project.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Started {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">
                        {project.status.replace('_', ' ')}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(project.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <select
                        value={project.status}
                        onChange={(e) => handleStatusChange(project.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="in_progress">In Progress</option>
                        <option value="on_hold">On Hold</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Overview</h3>
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{user.assignedProjects.length}</p>
                  <p className="text-xs text-gray-500">Projects</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link
              to="/team"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all team members →
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Sarah Johnson</span> updated sitemap for E-commerce project
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Client approved</span> Handshake Meeting stage
                </p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-warning-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Mike Wilson</span> logged 6 hours on Mobile App project
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Average Progress</h4>
          <p className="text-3xl font-bold text-primary-600">
            {projects.length > 0 
              ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
              : 0}%
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-success-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Completed Stages</h4>
          <p className="text-3xl font-bold text-success-600">
            {projects.reduce((total, project) => {
              return total + project.stages.filter(s => s.ikfApproved && s.clientApproved).length;
            }, 0)}
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-warning-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Pending Approvals</h4>
          <p className="text-3xl font-bold text-warning-600">{pendingApprovals}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
