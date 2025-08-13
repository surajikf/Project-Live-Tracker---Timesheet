import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock timesheets data
const mockTimesheets = [
  {
    id: 1,
    userId: 1,
    userName: 'John Smith',
    projectId: 1,
    projectName: 'E-commerce Website Redesign',
    stageId: 1,
    stageName: 'Handshake Meeting',
    hoursSpent: 8,
    workDescription: 'Initial client meeting, requirements gathering, project scope discussion',
    dateLogged: '2024-01-15',
    status: 'approved'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Sarah Johnson',
    projectId: 1,
    projectName: 'E-commerce Website Redesign',
    stageId: 2,
    stageName: 'Sitemap Finalization',
    hoursSpent: 12,
    workDescription: 'Created initial sitemap, conducted user research, defined information architecture',
    dateLogged: '2024-01-16',
    status: 'pending'
  },
  {
    id: 3,
    userId: 4,
    userName: 'Emily Davis',
    projectId: 1,
    projectName: 'E-commerce Website Redesign',
    stageId: 3,
    stageName: 'Data Gathering & Wireframes',
    hoursSpent: 16,
    workDescription: 'Collected design requirements, created wireframes, user flow diagrams',
    dateLogged: '2024-01-17',
    status: 'pending'
  },
  {
    id: 4,
    userId: 3,
    userName: 'Mike Wilson',
    projectId: 2,
    projectName: 'Mobile App Development',
    stageId: 1,
    stageName: 'Handshake Meeting',
    hoursSpent: 6,
    workDescription: 'Project kickoff meeting, technical requirements discussion',
    dateLogged: '2024-02-01',
    status: 'approved'
  }
];

export const fetchTimesheets = createAsyncThunk(
  'timesheets/fetchTimesheets',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockTimesheets;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logTimesheet = createAsyncThunk(
  'timesheets/logTimesheet',
  async (timesheetData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate new ID and add timestamp
      const newTimesheet = {
        ...timesheetData,
        id: Date.now(),
        dateLogged: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      
      return newTimesheet;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTimesheetStatus = createAsyncThunk(
  'timesheets/updateTimesheetStatus',
  async ({ timesheetId, status }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { timesheetId, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  timesheets: [],
  isLoading: false,
  error: null,
  selectedTimesheet: null
};

const timesheetsSlice = createSlice({
  name: 'timesheets',
  initialState,
  reducers: {
    setSelectedTimesheet: (state, action) => {
      state.selectedTimesheet = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimesheets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTimesheets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timesheets = action.payload;
        state.error = null;
      })
      .addCase(fetchTimesheets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logTimesheet.fulfilled, (state, action) => {
        state.timesheets.push(action.payload);
      })
      .addCase(updateTimesheetStatus.fulfilled, (state, action) => {
        const timesheet = state.timesheets.find(t => t.id === action.payload.timesheetId);
        if (timesheet) {
          timesheet.status = action.payload.status;
        }
      });
  },
});

export const { setSelectedTimesheet, clearError } = timesheetsSlice.actions;
export default timesheetsSlice.reducer;
