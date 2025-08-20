import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: 'demo123'
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Login successful, redirecting to dashboard...');
      // Force redirect using window.location for GitHub Pages
      setTimeout(() => {
        window.location.href = window.location.origin + window.location.pathname + '#/dashboard';
      }, 1000);
    }
  }, [isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  const handleDemoLogin = (role) => {
    const demoEmails = {
      admin: 'admin@company.com',
      team: 'team@company.com',
      client: 'client@company.com'
    };
    
    setCredentials({
      email: demoEmails[role],
      password: 'demo123'
    });
    
    dispatch(loginUser({
      email: demoEmails[role],
      password: 'demo123'
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Project Tracker
          </h2>
          <p className="text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </button>

            {/* Quick Demo Login */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="btn-primary w-full mb-2"
              >
                Quick Demo: Admin Login
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('team')}
                className="btn-secondary w-full mb-2"
              >
                Quick Demo: Team Login
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('client')}
                className="btn-warning w-full"
              >
                Quick Demo: Client Login
              </button>
            </div>
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">
              Try different user roles:
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleDemoLogin('admin')}
                className="btn-primary text-sm py-2"
              >
                Admin
              </button>
              <button
                onClick={() => handleDemoLogin('team')}
                className="btn-secondary text-sm py-2"
              >
                Team
              </button>
              <button
                onClick={() => handleDemoLogin('client')}
                className="btn-warning text-sm py-2"
              >
                Client
              </button>
            </div>
          </div>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Demo Credentials:</strong><br />
              Email: admin@company.com, team@company.com, or client@company.com<br />
              Password: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
