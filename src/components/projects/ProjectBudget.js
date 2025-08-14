import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  PieChart,
  BarChart3,
  Calendar,
  Target,
  Wallet,
  Receipt,
  Download,
  Upload
} from 'lucide-react';

const ProjectBudget = ({ project, projectMetrics }) => {
  const [viewMode, setViewMode] = useState('overview'); // overview, expenses, revenue, analytics
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ 
    description: '', 
    amount: '', 
    category: '', 
    date: '', 
    type: 'expense' 
  });
  const [newRevenue, setNewRevenue] = useState({ 
    description: '', 
    amount: '', 
    source: '', 
    date: '', 
    status: 'pending' 
  });

  // Mock budget data
  const [budgetData] = useState({
    totalBudget: 50000,
    allocatedBudget: 45000,
    spentBudget: 32000,
    remainingBudget: 13000,
    revenue: 60000,
    profit: 10000,
    expenses: [
      {
        id: 1,
        description: 'Design Software Licenses',
        amount: 2500,
        category: 'Software',
        date: '2024-01-15',
        type: 'expense',
        status: 'approved'
      },
      {
        id: 2,
        description: 'Team Training',
        amount: 3000,
        category: 'Training',
        date: '2024-01-20',
        type: 'expense',
        status: 'approved'
      },
      {
        id: 3,
        description: 'Cloud Infrastructure',
        amount: 1500,
        category: 'Infrastructure',
        date: '2024-02-01',
        type: 'expense',
        status: 'pending'
      },
      {
        id: 4,
        description: 'Client Meeting Expenses',
        amount: 800,
        category: 'Travel',
        date: '2024-02-10',
        type: 'expense',
        status: 'approved'
      }
    ],
    revenue: [
      {
        id: 1,
        description: 'Phase 1 Payment',
        amount: 25000,
        source: 'Client',
        date: '2024-01-15',
        status: 'received'
      },
      {
        id: 2,
        description: 'Phase 2 Payment',
        amount: 20000,
        source: 'Client',
        date: '2024-02-01',
        status: 'pending'
      },
      {
        id: 3,
        description: 'Additional Services',
        amount: 15000,
        source: 'Client',
        date: '2024-02-15',
        status: 'pending'
      }
    ]
  });

  // Calculate budget metrics
  const budgetMetrics = useMemo(() => {
    const spentPercentage = (budgetData.spentBudget / budgetData.totalBudget) * 100;
    const remainingPercentage = (budgetData.remainingBudget / budgetData.totalBudget) * 100;
    const profitMargin = (budgetData.profit / budgetData.revenue) * 100;
    
    const isOverBudget = budgetData.spentBudget > budgetData.totalBudget;
    const isNearBudget = spentPercentage > 80 && !isOverBudget;
    const isUnderBudget = spentPercentage < 60;
    
    return {
      spentPercentage,
      remainingPercentage,
      profitMargin,
      isOverBudget,
      isNearBudget,
      isUnderBudget,
      status: isOverBudget ? 'Over Budget' : isNearBudget ? 'Near Budget' : 'Under Budget'
    };
  }, [budgetData]);

  // Calculate expense categories
  const expenseCategories = useMemo(() => {
    const categories = {};
    budgetData.expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });
    return categories;
  }, [budgetData.expenses]);

  // Calculate monthly trends
  const monthlyTrends = useMemo(() => {
    const trends = {};
    budgetData.expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
      if (!trends[month]) {
        trends[month] = { expenses: 0, revenue: 0 };
      }
      trends[month].expenses += expense.amount;
    });
    
    budgetData.revenue.forEach(rev => {
      const month = new Date(rev.date).toLocaleString('default', { month: 'short' });
      if (!trends[month]) {
        trends[month] = { expenses: 0, revenue: 0 };
      }
      trends[month].revenue += rev.amount;
    });
    
    return trends;
  }, [budgetData]);

  const viewModes = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const expenseCategoriesList = [
    'Software', 'Training', 'Infrastructure', 'Travel', 'Marketing', 'Office', 'Other'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'received': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBudgetStatusColor = () => {
    if (budgetMetrics.isOverBudget) return 'text-red-600';
    if (budgetMetrics.isNearBudget) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount && newExpense.category) {
      // Add expense logic here
      setNewExpense({ description: '', amount: '', category: '', date: '', type: 'expense' });
      setShowExpenseModal(false);
    }
  };

  const handleAddRevenue = () => {
    if (newRevenue.description && newRevenue.amount && newRevenue.source) {
      // Add revenue logic here
      setNewRevenue({ description: '', amount: '', source: '', date: '', status: 'pending' });
      setShowRevenueModal(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Budget</h3>
          <p className="text-gray-600">Track project finances and budget management</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowExpenseModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </button>
          <button
            onClick={() => setShowRevenueModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Revenue
          </button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(budgetData.totalBudget)}</div>
            <div className="text-sm text-gray-600">Total Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(budgetData.spentBudget)}</div>
            <div className="text-sm text-gray-600">Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(budgetData.remainingBudget)}</div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getBudgetStatusColor()}`}>
              {budgetMetrics.status}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Budget Utilization</span>
            <span>{budgetMetrics.spentPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                budgetMetrics.isOverBudget ? 'bg-red-500' :
                budgetMetrics.isNearBudget ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, budgetMetrics.spentPercentage)}%` }}
            ></div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Revenue</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(budgetData.revenue)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-900">{formatCurrency(budgetData.spentBudget)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Profit</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(budgetData.profit)}</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
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

      {/* Overview View */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Categories Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h4>
            <div className="space-y-3">
              {Object.entries(expenseCategories).map(([category, amount]) => {
                const percentage = (amount / budgetData.spentBudget) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{category}</span>
                      <span className="text-gray-900">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h4>
            <div className="space-y-4">
              {Object.entries(monthlyTrends).map(([month, data]) => (
                <div key={month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{month}</span>
                    <span className="text-gray-900">
                      {formatCurrency(data.revenue - data.expenses)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-green-600">+{formatCurrency(data.revenue)}</div>
                    <div className="text-red-600">-{formatCurrency(data.expenses)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expenses View */}
      {viewMode === 'expenses' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">Expense Details</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgetData.expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Revenue View */}
      {viewMode === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">Revenue Details</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgetData.revenue.map((rev) => (
                    <tr key={rev.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rev.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(rev.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {rev.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(rev.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rev.status)}`}>
                          {rev.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget vs Actual */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Actual</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Budget Allocation</span>
                <span className="text-sm font-semibold text-gray-900">
                  {((budgetData.allocatedBudget / budgetData.totalBudget) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(budgetData.allocatedBudget / budgetData.totalBudget) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Budget Spent</span>
                <span className="text-sm font-semibold text-gray-900">
                  {budgetMetrics.spentPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    budgetMetrics.isOverBudget ? 'bg-red-500' :
                    budgetMetrics.isNearBudget ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${budgetMetrics.spentPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Profitability Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Profitability Analysis</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profit Margin</span>
                <span className="text-sm font-semibold text-green-600">
                  {budgetMetrics.profitMargin.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${budgetMetrics.profitMargin}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(budgetData.revenue)}
                  </div>
                  <div className="text-xs text-gray-600">Total Revenue</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(budgetData.profit)}
                  </div>
                  <div className="text-xs text-gray-600">Net Profit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Expense</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter expense description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {expenseCategoriesList.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Revenue Modal */}
      {showRevenueModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Revenue</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newRevenue.description}
                    onChange={(e) => setNewRevenue({...newRevenue, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter revenue description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={newRevenue.amount}
                    onChange={(e) => setNewRevenue({...newRevenue, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <input
                    type="text"
                    value={newRevenue.source}
                    onChange={(e) => setNewRevenue({...newRevenue, source: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter revenue source"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newRevenue.date}
                    onChange={(e) => setNewRevenue({...newRevenue, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRevenueModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRevenue}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Add Revenue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBudget;
