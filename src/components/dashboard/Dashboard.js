import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import TeamDashboard from './TeamDashboard';
import ClientDashboard from './ClientDashboard';
import QuickActions from '../actions/QuickActions';
import OnboardingGuide from '../onboarding/OnboardingGuide';
import { 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  Users,
  HelpCircle,
  Play
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { projects } = useSelector(state => state.projects);
  const { timesheets } = useSelector(state => state.timesheets);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Calculate dashboard stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  
  const pendingApprovals = projects.reduce((total, project) => {
    return total + project.stages.filter(stage => 
      !stage.ikfApproved || !stage.clientApproved
    ).length;
  }, 0);

  const totalHours = timesheets.reduce((sum, ts) => sum + ts.hoursSpent, 0);

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'team':
        return <TeamDashboard />;
      case 'client':
        return <ClientDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-primary-100">
              Here's what's happening with your projects today. 
              {user?.role === 'admin' && ' Manage your team and track progress.'}
              {user?.role === 'team' && ' Update your tasks and log your time.'}
              {user?.role === 'client' && ' Review progress and approve stages.'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowOnboarding(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors border border-white border-opacity-30"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Get Started</span>
            </button>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-warning-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingApprovals}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Hours</p>
              <p className="text-2xl font-semibold text-gray-900">{totalHours}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific Dashboard */}
      {renderDashboard()}

      {/* Quick Actions */}
      <QuickActions user={user} />

      {/* Onboarding Guide */}
      <OnboardingGuide 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </div>
  );
};

export default Dashboard;
