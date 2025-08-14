import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  Pause,
  TrendingUp,
  Milestone,
  Flag,
  Users,
  Target,
  BarChart3
} from 'lucide-react';

const ProjectTimeline = ({ project }) => {
  const [viewMode, setViewMode] = useState('timeline'); // timeline, gantt, calendar
  const [selectedStage, setSelectedStage] = useState(null);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ name: '', date: '', description: '' });

  // Mock milestones data
  const [milestones] = useState([
    {
      id: 1,
      name: 'Project Kickoff',
      date: '2024-01-15',
      type: 'start',
      completed: true,
      description: 'Project officially started with team briefing'
    },
    {
      id: 2,
      name: 'Design Phase Complete',
      date: '2024-02-01',
      type: 'milestone',
      completed: true,
      description: 'UI/UX design approved by client'
    },
    {
      id: 3,
      name: 'Development Phase',
      date: '2024-02-15',
      type: 'development',
      completed: false,
      description: 'Backend development in progress'
    },
    {
      id: 4,
      name: 'Testing Phase',
      date: '2024-03-01',
      type: 'testing',
      completed: false,
      description: 'QA testing and bug fixes'
    },
    {
      id: 5,
      name: 'Project Delivery',
      date: '2024-03-15',
      type: 'delivery',
      completed: false,
      description: 'Final delivery to client'
    }
  ]);

  // Calculate timeline metrics
  const timelineMetrics = useMemo(() => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.dueDate);
    const today = new Date();
    
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    const progressPercentage = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
    
    const isOnTrack = remainingDays >= 0 && progressPercentage <= project.progress;
    const isBehind = remainingDays < 0 || progressPercentage > project.progress;
    const isAhead = progressPercentage < project.progress && remainingDays > 0;
    
    return {
      totalDays,
      elapsedDays,
      remainingDays,
      progressPercentage,
      isOnTrack,
      isBehind,
      isAhead,
      status: isBehind ? 'Behind Schedule' : isAhead ? 'Ahead of Schedule' : 'On Track'
    };
  }, [project]);

  // Calculate stage timeline
  const stageTimeline = useMemo(() => {
    return project.stages.map((stage, index) => {
      const stageStartDate = new Date(project.startDate);
      const stageEndDate = new Date(project.dueDate);
      const stageDuration = Math.ceil((stageEndDate - stageStartDate) / (1000 * 60 * 60 * 24));
      const stageProgress = stage.internalApproved && stage.clientApproved ? 100 : 
                           stage.internalApproved ? 75 : 
                           stage.completedDate ? 50 : 25;
      
      return {
        ...stage,
        index,
        startDate: stageStartDate,
        endDate: stageEndDate,
        duration: stageDuration,
        progress: stageProgress,
        status: stage.internalApproved && stage.clientApproved ? 'completed' :
                stage.internalApproved ? 'pending_client' :
                stage.completedDate ? 'pending_internal' : 'not_started'
      };
    });
  }, [project]);

  const viewModes = [
    { id: 'timeline', label: 'Timeline View', icon: Calendar },
    { id: 'gantt', label: 'Gantt Chart', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar View', icon: Clock }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending_client': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending_internal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_started': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMilestoneIcon = (type) => {
    switch (type) {
      case 'start': return <Play className="w-4 h-4" />;
      case 'milestone': return <Milestone className="w-4 h-4" />;
      case 'development': return <TrendingUp className="w-4 h-4" />;
      case 'testing': return <Target className="w-4 h-4" />;
      case 'delivery': return <CheckCircle className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  const getMilestoneColor = (type) => {
    switch (type) {
      case 'start': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'milestone': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'development': return 'bg-green-100 text-green-600 border-green-200';
      case 'testing': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'delivery': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleAddMilestone = () => {
    if (newMilestone.name && newMilestone.date) {
      // Add milestone logic here
      setNewMilestone({ name: '', date: '', description: '' });
      setShowMilestoneModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
          <p className="text-gray-600">Track project progress and milestones</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowMilestoneModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Flag className="w-4 h-4 mr-2" />
            Add Milestone
          </button>
        </div>
      </div>

      {/* Timeline Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{timelineMetrics.totalDays}</div>
            <div className="text-sm text-gray-600">Total Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{timelineMetrics.elapsedDays}</div>
            <div className="text-sm text-gray-600">Elapsed Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{timelineMetrics.remainingDays}</div>
            <div className="text-sm text-gray-600">Remaining Days</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              timelineMetrics.isOnTrack ? 'text-green-600' :
              timelineMetrics.isBehind ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {timelineMetrics.status}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Timeline Progress</span>
            <span>{timelineMetrics.progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                timelineMetrics.isOnTrack ? 'bg-green-500' :
                timelineMetrics.isBehind ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${timelineMetrics.progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* View Mode Navigation */}
      <div className="bg-gray-50 rounded-lg p-1">
        <div className="flex space-x-1">
          {viewModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {/* Project Stages Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Stages</h4>
            <div className="space-y-4">
              {stageTimeline.map((stage, index) => (
                <div key={stage.id} className="relative">
                  {/* Timeline Line */}
                  {index < stageTimeline.length - 1 && (
                    <div className="absolute left-6 top-8 w-0.5 h-8 bg-gray-300"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    {/* Stage Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      stage.status === 'completed' ? 'bg-green-100 border-green-500' :
                      stage.status === 'pending_client' ? 'bg-blue-100 border-blue-500' :
                      stage.status === 'pending_internal' ? 'bg-yellow-100 border-yellow-500' :
                      'bg-gray-100 border-gray-300'
                    }`}>
                      {stage.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : stage.status === 'pending_client' ? (
                        <AlertTriangle className="w-6 h-6 text-blue-600" />
                      ) : stage.status === 'pending_internal' ? (
                        <Clock className="w-6 h-6 text-yellow-600" />
                      ) : (
                        <Play className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Stage Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{stage.name}</h5>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(stage.status)}`}>
                          {stage.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        {stage.startDate.toLocaleDateString()} - {stage.endDate.toLocaleDateString()} ({stage.duration} days)
                      </div>
                      
                      {/* Stage Progress */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            stage.status === 'completed' ? 'bg-green-500' :
                            stage.status === 'pending_client' ? 'bg-blue-500' :
                            stage.status === 'pending_internal' ? 'bg-yellow-500' :
                            'bg-gray-300'
                          }`}
                          style={{ width: `${stage.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {stage.progress}% complete
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Milestones</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-lg border-2 ${getMilestoneColor(milestone.type)} ${
                    milestone.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    {getMilestoneIcon(milestone.type)}
                    <h5 className="font-medium text-gray-900">{milestone.name}</h5>
                    {milestone.completed && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {new Date(milestone.date).toLocaleDateString()}
                  </div>
                  <p className="text-xs text-gray-600">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gantt Chart View */}
      {viewMode === 'gantt' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Gantt Chart</h4>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 mb-4 text-sm font-medium text-gray-600">
                <div className="col-span-3">Stage</div>
                <div className="col-span-2">Start</div>
                <div className="col-span-2">End</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-2">Progress</div>
                <div className="col-span-1">Status</div>
              </div>

              {/* Stages */}
              {stageTimeline.map((stage) => (
                <div key={stage.id} className="grid grid-cols-12 gap-2 py-3 border-b border-gray-100">
                  <div className="col-span-3 font-medium text-gray-900">{stage.name}</div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {stage.startDate.toLocaleDateString()}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {stage.endDate.toLocaleDateString()}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {stage.duration} days
                  </div>
                  <div className="col-span-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          stage.status === 'completed' ? 'bg-green-500' :
                          stage.status === 'pending_client' ? 'bg-blue-500' :
                          stage.status === 'pending_internal' ? 'bg-yellow-500' :
                          'bg-gray-300'
                        }`}
                        style={{ width: `${stage.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stage.status)}`}>
                      {stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Calendar View</h4>
          <div className="grid grid-cols-7 gap-1">
            {/* Calendar Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date(project.startDate);
              date.setDate(date.getDate() + i - 15); // Show 2 weeks before and after
              
              const isProjectDate = date >= new Date(project.startDate) && date <= new Date(project.dueDate);
              const isToday = date.toDateString() === new Date().toDateString();
              const milestone = milestones.find(m => m.date === date.toISOString().split('T')[0]);
              
              return (
                <div
                  key={i}
                  className={`p-2 min-h-[80px] border border-gray-100 text-sm ${
                    isToday ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="text-right text-gray-500 mb-1">
                    {date.getDate()}
                  </div>
                  
                  {isProjectDate && (
                    <div className="w-full h-1 bg-blue-200 rounded mb-1"></div>
                  )}
                  
                  {milestone && (
                    <div className={`text-xs p-1 rounded ${getMilestoneColor(milestone.type)}`}>
                      {milestone.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Milestone Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Milestone</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Milestone Name</label>
                  <input
                    type="text"
                    value={newMilestone.name}
                    onChange={(e) => setNewMilestone({...newMilestone, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter milestone name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newMilestone.date}
                    onChange={(e) => setNewMilestone({...newMilestone, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter milestone description"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowMilestoneModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMilestone}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add Milestone
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTimeline;
