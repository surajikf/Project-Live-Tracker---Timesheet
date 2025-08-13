import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play,
  Pause,
  Users,
  FileText,
  Code,
  Palette,
  Globe
} from 'lucide-react';

const ProcessWorkflow = ({ project }) => {
  const [hoveredStage, setHoveredStage] = useState(null);

  const stages = [
    {
      id: 1,
      name: 'Handshake Meeting',
      description: 'Initial project discussion and requirements gathering',
      icon: Users,
      weightage: 5,
      status: 'completed',
      completed: true,
      ikfApproved: true,
      clientApproved: true
    },
    {
      id: 2,
      name: 'Sitemap Finalization',
      description: 'Website structure and navigation planning',
      icon: FileText,
      weightage: 10,
      status: 'completed',
      completed: true,
      ikfApproved: true,
      clientApproved: true
    },
    {
      id: 3,
      name: 'Data Gathering & Wireframes',
      description: 'Content collection and layout mockups',
      icon: FileText,
      weightage: 15,
      status: 'in_progress',
      completed: false,
      ikfApproved: true,
      clientApproved: false
    },
    {
      id: 4,
      name: 'Content Writing',
      description: 'Website copy and content creation',
      icon: FileText,
      weightage: 20,
      status: 'pending',
      completed: false,
      ikfApproved: false,
      clientApproved: false
    },
    {
      id: 5,
      name: 'Design Phase',
      description: 'Visual design and UI/UX creation',
      icon: Palette,
      weightage: 25,
      status: 'pending',
      completed: false,
      ikfApproved: false,
      clientApproved: false
    },
    {
      id: 6,
      name: 'Development Phase',
      description: 'Frontend and backend development',
      icon: Code,
      weightage: 15,
      status: 'pending',
      completed: false,
      ikfApproved: false,
      clientApproved: false
    },
    {
      id: 7,
      name: 'Testing Phase',
      description: 'Quality assurance and testing',
      icon: CheckCircle,
      weightage: 5,
      status: 'pending',
      completed: false,
      ikfApproved: false,
      clientApproved: false
    },
    {
      id: 8,
      name: 'Go Live',
      description: 'Final deployment and launch',
      icon: Globe,
      weightage: 5,
      status: 'pending',
      completed: false,
      ikfApproved: false,
      clientApproved: false
    }
  ];

  const getStageStatus = (stage) => {
    if (stage.completed) return 'completed';
    if (stage.status === 'in_progress') return 'in_progress';
    if (stage.ikfApproved || stage.clientApproved) return 'partially_completed';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success-500 border-success-500';
      case 'in_progress':
        return 'bg-primary-500 border-primary-500';
      case 'partially_completed':
        return 'bg-warning-500 border-warning-500';
      case 'pending':
        return 'bg-gray-300 border-gray-300';
      default:
        return 'bg-gray-300 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-white" />;
      case 'partially_completed':
        return <Clock className="w-5 h-5 text-white" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getProgressPercentage = () => {
    const completedStages = stages.filter(s => s.completed);
    const totalWeightage = stages.reduce((sum, s) => sum + s.weightage, 0);
    const completedWeightage = completedStages.reduce((sum, s) => sum + s.weightage, 0);
    return Math.round((completedWeightage / totalWeightage) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Project Workflow</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">{getProgressPercentage()}%</p>
            <p className="text-sm text-gray-500">Overall Progress</p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          <div>
            <p className="font-medium text-gray-900">
              {stages.filter(s => s.completed).length}
            </p>
            <p className="text-gray-500">Completed</p>
          </div>
          <div>
            <p className="font-medium text-primary-600">
              {stages.filter(s => s.status === 'in_progress').length}
            </p>
            <p className="text-gray-500">In Progress</p>
          </div>
          <div>
            <p className="font-medium text-warning-600">
              {stages.filter(s => s.ikfApproved || s.clientApproved).length}
            </p>
            <p className="text-gray-500">Pending Approval</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">
              {stages.filter(s => !s.completed && s.status === 'pending').length}
            </p>
            <p className="text-gray-500">Not Started</p>
          </div>
        </div>
      </div>

      {/* Workflow Stages */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Project Stages</h3>
        
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage);
            const isLast = index === stages.length - 1;
            
            return (
              <div key={stage.id} className="relative">
                {/* Stage Item */}
                <div 
                  className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                    hoveredStage === stage.id 
                      ? 'border-primary-300 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onMouseEnter={() => setHoveredStage(stage.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  {/* Stage Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                  </div>

                  {/* Stage Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{stage.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{stage.weightage}%</span>
                        {stage.ikfApproved && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                            IKF ✓
                          </span>
                        )}
                        {stage.clientApproved && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Client ✓
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
                    
                    {/* Stage Status */}
                    <div className="flex items-center space-x-4 text-xs">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${
                        status === 'completed' ? 'bg-success-100 text-success-800' :
                        status === 'in_progress' ? 'bg-primary-100 text-primary-800' :
                        status === 'partially_completed' ? 'bg-warning-100 text-warning-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {status === 'completed' ? 'Completed' :
                         status === 'in_progress' ? 'In Progress' :
                         status === 'partially_completed' ? 'Pending Approval' :
                         'Not Started'}
                      </span>
                      
                      {stage.assignedTo && (
                        <span className="text-gray-500">
                          Assigned to: {stage.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connection Line */}
                {!isLast && (
                  <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Clock className="w-5 h-5 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Log Time</p>
              <p className="text-sm text-gray-500">Record work hours</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <FileText className="w-5 h-5 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Upload Files</p>
              <p className="text-sm text-gray-500">Share documents</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Users className="w-5 h-5 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Team Chat</p>
              <p className="text-sm text-gray-500">Collaborate</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessWorkflow;
