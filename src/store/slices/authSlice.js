import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock authentication - in real app, this would call API endpoints
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo - accept any password for demo emails
      const validEmails = ['admin@company.com', 'team@company.com', 'client@company.com'];
      
      if (!validEmails.includes(credentials.email) && credentials.password !== 'demo123') {
        return rejectWithValue('Invalid credentials');
      }
      
      // Mock user data based on role
      const mockUsers = {
        admin: {
          id: 1,
          name: 'Admin User',
          email: credentials.email,
          role: 'admin',
          permissions: ['all']
        },
        team: {
          id: 2,
          name: 'Team Member',
          email: credentials.email,
          role: 'team',
          permissions: ['view_assigned_projects', 'update_tasks', 'log_timesheets']
        },
        client: {
          id: 3,
          name: 'Client POC',
          email: credentials.email,
          role: 'client',
          permissions: ['view_own_projects', 'client_approval']
        }
      };
      
      // Determine role based on email (for demo purposes)
      let role = 'client';
      if (credentials.email.includes('admin')) role = 'admin';
      else if (credentials.email.includes('team')) role = 'team';
      
      return mockUsers[role];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return null;
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
