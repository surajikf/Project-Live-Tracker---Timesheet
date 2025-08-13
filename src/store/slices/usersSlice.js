import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Project Manager',
    department: 'Management',
    avatar: null,
    isActive: true,
    assignedProjects: [1, 2]
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Business Analyst',
    department: 'Analysis',
    avatar: null,
    isActive: true,
    assignedProjects: [1]
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    role: 'Developer',
    department: 'Development',
    avatar: null,
    isActive: true,
    assignedProjects: [2]
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'Designer',
    department: 'Design',
    avatar: null,
    isActive: true,
    assignedProjects: [1]
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@company.com',
    role: 'Content Writer',
    department: 'Content',
    avatar: null,
    isActive: true,
    assignedProjects: [1]
  },
  {
    id: 6,
    name: 'Lisa Garcia',
    email: 'lisa.garcia@company.com',
    role: 'QA Engineer',
    department: 'Quality Assurance',
    avatar: null,
    isActive: true,
    assignedProjects: []
  }
];

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockUsers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const assignUserToProject = createAsyncThunk(
  'users/assignUserToProject',
  async ({ userId, projectId, stageId }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { userId, projectId, stageId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  users: [],
  isLoading: false,
  error: null,
  selectedUser: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedUser, clearError } = usersSlice.actions;
export default usersSlice.reducer;
