import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  BarChart3, 
  PieChart,
  TrendingUp,
  Calendar,
  Users,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  Search,
  Eye,
  Printer
} from 'lucide-react';

const ProjectReports = ({ project }) => {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedReports, setSelectedReports] = useState([]);

  // Mock report data
  const [reportData] = useState({
    overview: {
      projectHealth: 85,
      timelineStatus: 'On Track',
      budgetStatus: 'Under Budget',
      teamPerformance: 92,
      riskLevel: 'Low',
      qualityScore: 88
    },
    performance: {
      milestones: [
        { name: 'Design Phase', completed: true, date: '2024-02-01', delay: 0 },
        { name: 'Development Phase', completed: false, date: '2024-03-01', delay: 2 },
        { name: 'Testing Phase', completed: false, date: '2024-03-15', delay: 0 },
        { name: 'Deployment', completed: false, date: '2024-04-01', delay: 0 }
      ],
      productivity: [
        { week: 'Week 1', hours: 120, tasks: 15, completed: 12 },
        { week: 'Week 2', hours: 135, tasks: 18, completed: 16 },
        { week: 'Week 3', hours: 110, tasks: 20, completed: 18 },
        { week: 'Week 4', hours: 125, tasks: 22, completed: 20 }
      ]
    },
    financial: {
      budgetUtilization: 64,
      costVariance: -12,
      revenueRecognition: 50,
      cashFlow: 'Positive',
      roi: 120
    },
    quality: {
      defects: [
        { severity: 'Critical', count: 2, resolved: 2, open: 0 },
        { severity: 'High', count: 8, resolved: 6, open: 2 },
        { severity: 'Medium', count: 15, resolved: 12, open: 3 },
        { severity: 'Low', count: 25, resolved: 20, open: 5 }
      ],
      testCoverage: 87,
      codeQuality: 'A',
      performanceScore: 92
    }
  });

  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: Eye, color: 'blue' },
    { id: 'performance', label: 'Performance', icon: TrendingUp, color: 'green' },
    { id: 'financial', label: 'Financial', icon: BarChart3, color: 'purple' },
    { id: 'quality', label: 'Quality', icon: Target, color: 'orange' },
    { id: 'timeline', label: 'Timeline', icon: Calendar, color: 'indigo' },
    { id: 'team', label: 'Team', icon: Users, color: 'pink' }
  ];

  const dateRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const exportFormats = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'excel', label: 'Excel', icon: BarChart3 },
    { value: 'csv', label: 'CSV', icon: FileText },
    { value: 'word', label: 'Word', icon: FileText }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Track': return 'text-green-600 bg-green-100';
      case 'Behind Schedule': return 'text-red-600 bg-red-100';
      case 'At Risk': return 'text-yellow-600 bg-yellow-100';
      case 'Under Budget': return 'text-green-600 bg-green-100';
      case 'Over Budget': return 'text-red-600 bg-red-100';
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleExport = () => {
    // Export logic here
    console.log(`Exporting ${selectedReports.length} reports in ${exportFormat} format`);
    setShowExportModal(false);
  };

  const handleSelectReport = (reportId) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Project Health Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Project Health</h4>
            <Target className="w-6 h-6 text-blue-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(reportData.overview.projectHealth)}`}>
            {reportData.overview.projectHealth}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${reportData.overview.projectHealth}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Timeline Status</h4>
            <Calendar className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {reportData.overview.timelineStatus}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reportData.overview.timelineStatus)}`}>
            {reportData.overview.timelineStatus}
          </span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Budget Status</h4>
            <BarChart3 className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {reportData.overview.budgetStatus}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reportData.overview.budgetStatus)}`}>
            {reportData.overview.budgetStatus}
          </span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Team Performance</h4>
            <Users className="w-6 h-6 text-indigo-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(reportData.overview.teamPerformance)}`}>
            {reportData.overview.teamPerformance}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${reportData.overview.teamPerformance}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Risk Level</h4>
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {reportData.overview.riskLevel}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reportData.overview.riskLevel)}`}>
            {reportData.overview.riskLevel}
          </span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Quality Score</h4>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(reportData.overview.qualityScore)}`}>
            {reportData.overview.qualityScore}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${reportData.overview.qualityScore}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceReport = () => (
    <div className="space-y-6">
      {/* Milestones Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Milestones Progress</h4>
        <div className="space-y-4">
          {reportData.performance.milestones.map((milestone, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <div>
                  <h5 className="font-medium text-gray-900">{milestone.name}</h5>
                  <p className="text-sm text-gray-600">Due: {milestone.date}</p>
                </div>
              </div>
              <div className="text-right">
                {milestone.completed ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {milestone.delay > 0 ? `${milestone.delay} days late` : 'On Track'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Productivity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Productivity</h4>
        <div className="space-y-4">
          {reportData.performance.productivity.map((week, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{week.week}</span>
                <span className="text-gray-900">
                  {week.completed}/{week.tasks} tasks ({((week.completed / week.tasks) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(week.completed / week.tasks) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                {week.hours}h logged
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Budget Utilization</h4>
          <div className={`text-3xl font-bold ${getScoreColor(reportData.financial.budgetUtilization)}`}>
            {reportData.financial.budgetUtilization}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${reportData.financial.budgetUtilization}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Variance</h4>
          <div className={`text-3xl font-bold ${reportData.financial.costVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {reportData.financial.costVariance >= 0 ? '+' : ''}{reportData.financial.costVariance}%
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {reportData.financial.costVariance >= 0 ? 'Over budget' : 'Under budget'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenue Recognition</h4>
          <div className="text-3xl font-bold text-blue-600">
            {reportData.financial.revenueRecognition}%
          </div>
          <p className="text-sm text-gray-600 mt-2">Recognized</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">ROI</h4>
          <div className="text-3xl font-bold text-green-600">
            {reportData.financial.roi}%
          </div>
          <p className="text-sm text-gray-600 mt-2">Return on Investment</p>
        </div>
      </div>
    </div>
  );

  const renderQualityReport = () => (
    <div className="space-y-6">
      {/* Defects Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Defects Summary</h4>
        <div className="space-y-4">
          {reportData.quality.defects.map((defect, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${
                  defect.severity === 'Critical' ? 'bg-red-500' :
                  defect.severity === 'High' ? 'bg-orange-500' :
                  defect.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <h5 className="font-medium text-gray-900">{defect.severity}</h5>
                  <p className="text-sm text-gray-600">
                    {defect.resolved} resolved, {defect.open} open
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{defect.count}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Test Coverage</h4>
          <div className={`text-3xl font-bold ${getScoreColor(reportData.quality.testCoverage)}`}>
            {reportData.quality.testCoverage}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${reportData.quality.testCoverage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Code Quality</h4>
          <div className="text-3xl font-bold text-green-600">
            {reportData.quality.codeQuality}
          </div>
          <p className="text-sm text-gray-600 mt-2">Grade</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Score</h4>
          <div className={`text-3xl font-bold ${getScoreColor(reportData.quality.performanceScore)}`}>
            {reportData.quality.performanceScore}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${reportData.quality.performanceScore}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReport = () => {
    switch (reportType) {
      case 'overview':
        return renderOverviewReport();
      case 'performance':
        return renderPerformanceReport();
      case 'financial':
        return renderFinancialReport();
      case 'quality':
        return renderQualityReport();
      default:
        return <div>Select a report type to view</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Reports</h3>
          <p className="text-gray-600">Generate and view comprehensive project reports</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* Report Type Navigation */}
      <div className="bg-gray-50 rounded-lg p-1">
        <div className="flex space-x-1 overflow-x-auto">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`flex-shrink-0 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  reportType === type.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Date Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {renderReport()}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Reports</h3>
              
              {/* Report Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Reports:</label>
                <div className="space-y-2">
                  {reportTypes.map((type) => (
                    <label key={type.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(type.id)}
                        onChange={() => handleSelectReport(type.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Export Format */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format:</label>
                <div className="grid grid-cols-2 gap-2">
                  {exportFormats.map((format) => {
                    const Icon = format.icon;
                    return (
                      <label key={format.value} className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="exportFormat"
                          value={format.value}
                          checked={exportFormat === format.value}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <Icon className="w-4 h-4 ml-2 text-gray-600" />
                        <span className="ml-2 text-sm text-gray-700">{format.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={selectedReports.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectReports;
