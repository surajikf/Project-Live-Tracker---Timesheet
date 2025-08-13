import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Users, 
  User, 
  Mail, 
  Building, 
  Calendar,
  Filter,
  Search,
  Eye,
  MessageSquare
} from 'lucide-react';

const Team = () => {
  const { users } = useSelector(state => state.users);
  const { projects } = useSelector(state => state.projects);
  const { user: currentUser } = useSelector(state => state.auth);
  
  const [filters, setFilters] = useState({
    department: 'all',
    role: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Apply search
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.role.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply department filter
    if (filters.department !== 'all' && user.department !== filters.department) {
      return false;
    }
    
    // Apply role filter
    if (filters.role !== 'all' && user.role !== filters.role) {
      return false;
    }
    
    return true;
  });

  // Get unique departments and roles for filters
  const departments = [...new Set(users.map(u => u.department))];
  const roles = [...new Set(users.map(u => u.role))];

  // Get user's assigned projects
  const getUserProjects = (userId) => {
    return projects.filter(project => 
      project.stages.some(stage => 
        stage.assignedTo === users.find(u => u.id === userId)?.name ||
        stage.assignedRole.includes(users.find(u => u.id === userId)?.role)
      )
    );
  };

  // Calculate user's total hours (mock data for demo)
  const getUserTotalHours = (userId) => {
    // In real app, this would come from timesheets
    return Math.floor(Math.random() * 100) + 20;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600">Manage your team members and their assignments</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            {filteredUsers.length} of {users.length} team members
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="input-field"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="input-field"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Total Team</h4>
          <p className="text-3xl font-bold text-primary-600">{users.length}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Building className="w-6 h-6 text-success-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Departments</h4>
          <p className="text-3xl font-bold text-success-600">{departments.length}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-warning-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Active Projects</h4>
          <p className="text-3xl font-bold text-warning-600">
            {projects.filter(p => p.status === 'in_progress').length}
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-gray-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Avg. Hours</h4>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(users.reduce((sum, u) => sum + getUserTotalHours(u.id), 0) / users.length)}
          </p>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const userProjects = getUserProjects(user.id);
          const totalHours = getUserTotalHours(user.id);
          
          return (
            <div key={user.id} className="card hover:shadow-lg transition-shadow">
              {/* User Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.isActive ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="w-4 h-4 mr-2" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{totalHours}h logged</span>
                </div>
              </div>

              {/* Project Assignments */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Current Projects</h4>
                {userProjects.length > 0 ? (
                  <div className="space-y-2">
                    {userProjects.slice(0, 2).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                          <p className="text-xs text-gray-500">{project.client}</p>
                        </div>
                        <div className="text-right">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-primary-600 h-1.5 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{project.progress}%</p>
                        </div>
                      </div>
                    ))}
                    {userProjects.length > 2 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{userProjects.length - 2} more projects
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">No active projects</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  <Eye className="w-4 h-4 inline mr-1" />
                  View Profile
                </button>
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Message
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Breakdown */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Department Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const deptUsers = users.filter(u => u.department === dept);
            const deptProjects = projects.filter(project => 
              project.stages.some(stage => 
                deptUsers.some(user => 
                  stage.assignedTo === user.name || 
                  stage.assignedRole.includes(user.role)
                )
              )
            );
            
            return (
              <div key={dept} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{dept}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Team Members:</span>
                    <span className="font-medium">{deptUsers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Active Projects:</span>
                    <span className="font-medium">
                      {deptProjects.filter(p => p.status === 'in_progress').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Hours:</span>
                    <span className="font-medium">
                      {deptUsers.reduce((sum, u) => sum + getUserTotalHours(u.id), 0)}h
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Performance */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Team Performance</h3>
        <div className="space-y-4">
          {users.slice(0, 5).map((user) => {
            const userProjects = getUserProjects(user.id);
            const totalHours = getUserTotalHours(user.id);
            const avgProgress = userProjects.length > 0 
              ? Math.round(userProjects.reduce((sum, p) => sum + p.progress, 0) / userProjects.length)
              : 0;
            
            return (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500">Projects</p>
                    <p className="font-medium">{userProjects.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Avg. Progress</p>
                    <p className="font-medium">{avgProgress}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Hours</p>
                    <p className="font-medium">{totalHours}h</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Team;
