import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  BarChart3, 
  Users, 
  Target, 
  Award, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Bell,
  Settings,
  RefreshCw,
  Wifi,
  WifiOff,
  Cloud,
  Sun,
  CloudRain,
  Eye,
  EyeOff,
  Plus,
  Play,
  Pause
} from 'lucide-react';
import ProjectAnalytics from '../analytics/ProjectAnalytics';
import TeamPerformance from '../team/TeamPerformance';
import RecentActivities from '../activities/RecentActivities';

const EnhancedDashboard = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { projects } = useSelector(state => state.projects);
  const { timesheets } = useSelector(state => state.timesheets);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [weatherData, setWeatherData] = useState(null);
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time system monitoring
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Simulate weather data
    const fetchWeather = async () => {
      try {
        const mockWeather = {
          temperature: Math.floor(Math.random() * 30) + 10,
          condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
          humidity: Math.floor(Math.random() * 40) + 40,
          windSpeed: Math.floor(Math.random() * 20) + 5
        };
        setWeatherData(mockWeather);
      } catch (error) {
        console.log('Weather data unavailable');
      }
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 300000);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      clearInterval(weatherInterval);
    };
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      console.log('Auto-refreshing dashboard data...');
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Live notifications simulation
  useEffect(() => {
    const notificationTypes = [
      { type: 'project', message: 'New project milestone reached', priority: 'medium' },
      { type: 'team', message: 'Team member completed task', priority: 'low' },
      { type: 'system', message: 'System backup completed', priority: 'low' },
      { type: 'alert', message: 'Project deadline approaching', priority: 'high' }
    ];

    const addNotification = () => {
      const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const newNotification = {
        id: Date.now(),
        ...randomNotification,
        timestamp: new Date(),
        read: false
      };
      
      setLiveNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    };

    const notificationInterval = setInterval(addNotification, 15000);
    return () => clearInterval(notificationInterval);
  }, []);

  // Calculate enhanced metrics
  const enhancedMetrics = useMemo(() => {
    const now = new Date();
    const activeProjects = projects.filter(p => p.status === 'In Progress');
    const completedProjects = projects.filter(p => p.status === 'Completed');
    const overdueProjects = projects.filter(p => {
      if (!p.deadline) return false;
      return new Date(p.deadline) < now && p.status !== 'Completed';
    });

    const totalHours = timesheets.reduce((sum, ts) => sum + ts.hours, 0);
    const avgProjectDuration = projects.length > 0 
      ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length 
      : 0;

    const projectHealth = projects.length > 0 
      ? projects.reduce((sum, p) => {
          let health = 100;
          if (p.progress < 50 && new Date(p.deadline) < now) health -= 30;
          if (p.progress < 30) health -= 20;
          return sum + health;
        }, 0) / projects.length 
      : 100;

    return {
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      overdueProjects: overdueProjects.length,
      totalHours,
      avgProjectDuration: Math.round(avgProjectDuration),
      projectHealth: Math.round(projectHealth),
      efficiency: Math.round((completedProjects.length / projects.length) * 100) || 0
    };
  }, [projects, timesheets]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'Cloudy': return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'Rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
      default: return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'performance', label: 'Performance', icon: '🎯' },
    { id: 'activities', label: 'Activities', icon: '📝' },
    { id: 'monitoring', label: 'System', icon: '🔧' }
  ];

  const QuickActions = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
          <Plus className="w-6 h-6 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-gray-700">New Project</span>
        </button>
        <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
          <Clock className="w-6 h-6 text-green-600 mb-2" />
          <span className="text-sm font-medium text-gray-700">Log Time</span>
        </button>
        <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
          <Users className="w-6 h-6 text-purple-600 mb-2" />
          <span className="text-sm font-medium text-gray-700">Team Chat</span>
        </button>
        <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors">
          <FileText className="w-6 h-6 text-orange-600 mb-2" />
          <span className="text-sm font-medium text-gray-700">Reports</span>
        </button>
      </div>
    </div>
  );

  const SystemMonitoring = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">System Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Online Status</span>
              <span className={`inline-flex items-center ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="ml-1 text-xs">{isOnline ? 'Online' : 'Offline'}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-refresh</span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoRefresh ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Refresh Interval</span>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={60}>1m</option>
                <option value={300}>5m</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Weather</h4>
          {weatherData ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{weatherData.temperature}°C</span>
                {getWeatherIcon(weatherData.condition)}
              </div>
              <div className="text-sm text-gray-600">{weatherData.condition}</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>Humidity: {weatherData.humidity}%</div>
                <div>Wind: {weatherData.windSpeed} km/h</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Loading weather...</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Live Updates</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {liveNotifications.slice(0, 3).map(notification => (
              <div key={notification.id} className="flex items-start space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.priority === 'high' ? 'bg-red-500' :
                  notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-gray-700">{notification.message}</p>
                  <p className="text-gray-500">{notification.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Performance Metrics</h4>
          <button
            onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showAdvancedMetrics ? <EyeOff className="w-4 h-4 inline mr-1" /> : <Eye className="w-4 h-4 inline mr-1" />}
            {showAdvancedMetrics ? 'Hide' : 'Show'} Advanced
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{enhancedMetrics.activeProjects}</div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{enhancedMetrics.completedProjects}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{enhancedMetrics.overdueProjects}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{enhancedMetrics.efficiency}%</div>
            <div className="text-sm text-gray-600">Efficiency</div>
          </div>
        </div>

        {showAdvancedMetrics && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{enhancedMetrics.totalHours}h</div>
                <div className="text-sm text-gray-600">Total Hours Logged</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{enhancedMetrics.avgProjectDuration}%</div>
                <div className="text-sm text-gray-600">Avg Project Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{enhancedMetrics.projectHealth}%</div>
                <div className="text-sm text-gray-600">Project Health</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return <div>Please log in to view the dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Real-time Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}! 👋</h1>
              <p className="text-blue-100 mt-2">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date().toLocaleTimeString()}
                </span>
                <span className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-white hover:bg-white hover:text-blue-600 rounded-md transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-semibold text-gray-900">{enhancedMetrics.activeProjects}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% from last month
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">{enhancedMetrics.completedProjects}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {enhancedMetrics.efficiency}% success rate
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hours Logged</p>
                    <p className="text-2xl font-semibold text-gray-900">{enhancedMetrics.totalHours}h</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-blue-600">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    This week
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Project Health</p>
                    <p className="text-2xl font-semibold text-gray-900">{enhancedMetrics.projectHealth}%</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        enhancedMetrics.projectHealth >= 80 ? 'bg-green-500' :
                        enhancedMetrics.projectHealth >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${enhancedMetrics.projectHealth}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        )}

        {activeTab === 'analytics' && (
          <ProjectAnalytics projects={projects} timesheets={timesheets} />
        )}

        {activeTab === 'performance' && (
          <TeamPerformance projects={projects} timesheets={timesheets} />
        )}

        {activeTab === 'activities' && (
          <RecentActivities projects={projects} timesheets={timesheets} />
        )}

        {activeTab === 'monitoring' && (
          <SystemMonitoring />
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboard;
