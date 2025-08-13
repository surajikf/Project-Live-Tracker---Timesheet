import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  Users, 
  FileText, 
  Clock, 
  Settings,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';

const OnboardingGuide = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Project Tracker!",
      description: "Let's get you started with managing your projects efficiently",
      icon: Play,
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <Play className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Project Management Made Simple</h3>
          <p className="text-gray-600">
            Track progress, manage teams, and collaborate with clients all in one place.
            This guide will show you the key features in just a few minutes.
          </p>
        </div>
      )
    },
    {
      title: "Dashboard Overview",
      description: "Your central command center for all projects",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-primary-600" />
            <h4 className="font-medium text-gray-900">Quick Access to Everything</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success-500" />
              <span>View all your projects at a glance</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success-500" />
              <span>See progress and pending approvals</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success-500" />
              <span>Access quick actions and shortcuts</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Project Workflow",
      description: "How projects move through stages",
      icon: CheckCircle,
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-primary-600" />
            <h4 className="font-medium text-gray-900">8-Stage Process</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-primary-500 rounded-full"></span>
                <span>1. Handshake Meeting</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-primary-500 rounded-full"></span>
                <span>2. Sitemap Finalization</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-primary-500 rounded-full"></span>
                <span>3. Data Gathering & Wireframes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
                <span className="text-gray-500">4. Content Writing</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
                <span className="text-gray-500">5. Design Phase</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
                <span className="text-gray-500">6. Development Phase</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
                <span className="text-gray-500">7. Testing Phase</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
                <span className="text-gray-500">8. Go Live</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Each stage requires both IKF and Client approval before moving to the next.
          </p>
        </div>
      )
    },
    {
      title: "Team Collaboration",
      description: "Working together effectively",
      icon: Users,
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-primary-600" />
            <h4 className="font-medium text-gray-900">Role-Based Access</h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h5 className="font-medium text-blue-900">Admin/Project Manager</h5>
              <p className="text-sm text-blue-700">Full control over all projects and team management</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h5 className="font-medium text-green-900">Internal Team</h5>
              <p className="text-sm text-green-700">Update progress, log time, and manage assigned tasks</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h5 className="font-medium text-purple-900">Client POC</h5>
              <p className="text-sm text-purple-700">Track progress and approve completed stages</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Time Tracking",
      description: "Log your work hours efficiently",
      icon: Clock,
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-primary-600" />
            <h4 className="font-medium text-gray-900">Simple Time Logging</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                <span className="text-sm">Select project and stage</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                <span className="text-sm">Enter hours worked</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                <span className="text-sm">Add work description</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                <span className="text-sm">Submit for approval</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Ready to start managing projects",
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Ready to Go!</h3>
          <p className="text-gray-600">
            You now understand the key features and workflow. 
            Start by exploring your dashboard or creating your first project.
          </p>
          <div className="bg-primary-50 rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2">Pro Tips:</h4>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• Use the search and filters to find projects quickly</li>
              <li>• Set up notifications for pending approvals</li>
              <li>• Regular updates keep everyone informed</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Getting Started Guide</h2>
            <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {steps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
            {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;
