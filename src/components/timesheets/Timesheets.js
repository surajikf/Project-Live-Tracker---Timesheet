import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logTimesheet, updateTimesheetStatus } from '../../store/slices/timesheetsSlice';
import { 
  Plus, 
  Clock, 
  Calendar, 
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Edit
} from 'lucide-react';

const Timesheets = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { projects } = useSelector(state => state.projects);
  const { timesheets } = useSelector(state => state.timesheets);
  
  const [showLogForm, setShowLogForm] = useState(false);
  const [filters, setFilters] = useState({
    project: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter timesheets based on user role and filters
  const filteredTimesheets = timesheets.filter(ts => {
    // Role-based filtering
    if (user?.role === 'client') return false; // Clients can't see timesheets
    if (user?.role === 'team' && ts.userName !== user?.name) return false;
    
    // Apply filters
    if (filters.project !== 'all' && ts.projectId !== parseInt(filters.project)) return false;
    if (filters.status !== 'all' && ts.status !== filters.status) return false;
    
    // Apply search
    if (searchTerm && !ts.workDescription.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  const [newTimesheet, setNewTimesheet] = useState({
    projectId: '',
    stageId: '',
    hoursSpent: '',
    workDescription: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const timesheetData = {
      ...newTimesheet,
      userId: user.id,
      userName: user.name,
      projectName: projects.find(p => p.id === parseInt(newTimesheet.projectId))?.name || '',
      stageName: projects
        .find(p => p.id === parseInt(newTimesheet.projectId))
        ?.stages.find(s => s.id === parseInt(newTimesheet.stageId))?.name || ''
    };
    
    dispatch(logTimesheet(timesheetData));
    setNewTimesheet({ projectId: '', stageId: '', hoursSpent: '', workDescription: '' });
    setShowLogForm(false);
  };

  const handleStatusUpdate = (timesheetId, status) => {
    dispatch(updateTimesheetStatus({ timesheetId, status }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success-100 text-success-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'rejected':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheets</h1>
          <p className="text-gray-600">Track and manage work hours</p>
        </div>
        
        {user?.role !== 'client' && (
          <button
            onClick={() => setShowLogForm(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Time
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search work descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
              className="input-field"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log Time Form */}
      {showLogForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Log Time</h3>
            <button
              onClick={() => setShowLogForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project
                </label>
                <select
                  required
                  value={newTimesheet.projectId}
                  onChange={(e) => setNewTimesheet({ ...newTimesheet, projectId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage
                </label>
                <select
                  required
                  value={newTimesheet.stageId}
                  onChange={(e) => setNewTimesheet({ ...newTimesheet, stageId: e.target.value })}
                  className="input-field"
                  disabled={!newTimesheet.projectId}
                >
                  <option value="">Select Stage</option>
                  {newTimesheet.projectId && projects
                    .find(p => p.id === parseInt(newTimesheet.projectId))
                    ?.stages.map(stage => (
                      <option key={stage.id} value={stage.id}>{stage.name}</option>
                    ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours Spent
                </label>
                <input
                  type="number"
                  required
                  min="0.5"
                  step="0.5"
                  value={newTimesheet.hoursSpent}
                  onChange={(e) => setNewTimesheet({ ...newTimesheet, hoursSpent: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 8.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Description
              </label>
              <textarea
                required
                rows={3}
                value={newTimesheet.workDescription}
                onChange={(e) => setNewTimesheet({ ...newTimesheet, workDescription: e.target.value })}
                className="input-field"
                placeholder="Describe the work you completed..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowLogForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Log Time
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timesheets Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Time Entries</h3>
        
        {filteredTimesheets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTimesheets.map((timesheet) => (
                  <tr key={timesheet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(timesheet.dateLogged).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {timesheet.userName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{timesheet.userName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {timesheet.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {timesheet.stageName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {timesheet.hoursSpent}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(timesheet.status)}`}>
                        {getStatusIcon(timesheet.status)}
                        <span className="ml-1 capitalize">{timesheet.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {user?.role === 'admin' && (
                          <select
                            value={timesheet.status}
                            onChange={(e) => handleStatusUpdate(timesheet.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No timesheet entries found</p>
            {user?.role !== 'client' && (
              <button
                onClick={() => setShowLogForm(true)}
                className="btn-primary mt-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Entry
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {filteredTimesheets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Total Hours</h4>
            <p className="text-3xl font-bold text-primary-600">
              {filteredTimesheets.reduce((sum, ts) => sum + ts.hoursSpent, 0)}h
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Approved Hours</h4>
            <p className="text-3xl font-bold text-success-600">
              {filteredTimesheets
                .filter(ts => ts.status === 'approved')
                .reduce((sum, ts) => sum + ts.hoursSpent, 0)}h
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-warning-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Pending Hours</h4>
            <p className="text-3xl font-bold text-warning-600">
              {filteredTimesheets
                .filter(ts => ts.status === 'pending')
                .reduce((sum, ts) => sum + ts.hoursSpent, 0)}h
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timesheets;
