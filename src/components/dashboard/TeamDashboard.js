import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Calendar,
  User
} from 'lucide-react';

const TeamDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { projects } = useSelector(state => state.projects);
  const { timesheets } = useSelector(state => state.timesheets);

  // Filter projects assigned to current user
  const assignedProjects = projects.filter(project => 
    project.stages.some(stage => 
      stage.assignedTo === user?.name || 
      stage.assignedRole.includes(user?.role)
    )
  );

  // Get user's timesheets
  const userTimesheets = timesheets.filter(ts => ts.userName === user?.name);
  const totalHoursThisWeek = userTimesheets
    .filter(ts => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(ts.dateLogged) >= weekAgo;
    })
    .reduce((sum, ts) => sum + ts.hoursSpent, 0);

  // Get pending tasks
  const pendingTasks = assignedProjects.flatMap(project => 
    project.stages
      .filter(stage => 
        (stage.assignedTo === user?.name || stage.assignedRole.includes(user?.role)) &&
        (!stage.ikfApproved || !stage.clientApproved)
      )
      .map(stage => ({
        ...stage,
        projectName: project.name,
        projectId: project.id
      }))
  );

  return (
    <div className="space-y-6">
      {/* My Projects */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">My Assigned Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedProjects.map((project) => (
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
                <p>Client: {project.client}</p>
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

      {/* Pending Tasks */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">My Pending Tasks</h3>
        {pendingTasks.length > 0 ? (
          <div className="space-y-3">
            {pendingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{task.name}</p>
                    <p className="text-sm text-gray-500">{task.projectName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{task.weightage}%</p>
                  <p className="text-xs text-gray-500">Weightage</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No pending tasks at the moment!</p>
        )}
      </div>

      {/* Time Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Time Tracking</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">This Week</span>
              </div>
              <span className="text-lg font-bold text-primary-600">{totalHoursThisWeek}h</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Total Hours</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {userTimesheets.reduce((sum, ts) => sum + ts.hoursSpent, 0)}h
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <Link
              to="/timesheets"
              className="btn-primary w-full text-center"
            >
              Log Time
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {userTimesheets.slice(0, 3).map((timesheet) => (
              <div key={timesheet.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">
                    Logged <span className="font-medium">{timesheet.hoursSpent}h</span> on {timesheet.stageName}
                  </p>
                  <p className="text-xs text-gray-500">{timesheet.dateLogged}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/timesheets"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Clock className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Log Time</p>
              <p className="text-sm text-gray-500">Record your work hours</p>
            </div>
          </Link>

          <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <User className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Update Progress</p>
              <p className="text-sm text-gray-500">Mark tasks as complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
