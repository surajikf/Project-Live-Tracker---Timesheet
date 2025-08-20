import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from './store/slices/projectsSlice';
import { fetchUsers } from './store/slices/usersSlice';
import { fetchTimesheets } from './store/slices/timesheetsSlice';

// Components
import Login from './components/auth/Login';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Projects from './components/projects/Projects';
import ProjectDetail from './components/projects/ProjectDetail';
import Timesheets from './components/timesheets/Timesheets';
import Team from './components/team/Team';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  console.log('App render - isAuthenticated:', isAuthenticated, 'user:', user);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User authenticated, fetching data...');
      dispatch(fetchProjects());
      dispatch(fetchUsers());
      dispatch(fetchTimesheets());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    console.log('Not authenticated, showing Login');
    return <Login />;
  }

  console.log('Authenticated, showing dashboard');

  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects/:projectId" 
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/timesheets" 
            element={
              <ProtectedRoute>
                <Timesheets />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/team" 
            element={
              <ProtectedRoute>
                <Team />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
