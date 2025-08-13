import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Project stages configuration
export const PROJECT_STAGES = [
  {
    id: 1,
    name: 'Handshake Meeting',
    assignedRole: 'Project Manager/BA',
    weightage: 5,
    requiresIKFApproval: true,
    requiresClientApproval: true
  },
  {
    id: 2,
    name: 'Sitemap Finalization',
    assignedRole: 'BA + Client',
    weightage: 10,
    requiresIKFApproval: true,
    requiresClientApproval: true
  },
  {
    id: 3,
    name: 'Data Gathering & Wireframes',
    assignedRole: 'BA + Designer',
    weightage: 15,
    requiresIKFApproval: true,
    requiresClientApproval: true
  },
  {
    id: 4,
    name: 'Content Writing',
    assignedRole: 'Content Writer',
    weightage: 10,
    requiresIKFApproval: true,
    requiresClientApproval: true
  },
  {
    id: 5,
    name: 'Design Phase',
    assignedRole: 'Designer',
    weightage: 20,
    requiresIKFApproval: true,
    requiresClientApproval: true
  },
  {
    id: 6,
    name: 'Development Phase',
    assignedRole: 'Developer',
    weightage: 25,
    requiresIKFApproval: true,
    requiresClientApproval: true
  },
  {
    id: 7,
    name: 'Testing Phase',
    assignedRole: 'QA Team',
    weightage: 10,
    requiresIKFApproval: true,
    requiresClientApproval: true
  },
  {
    id: 8,
    name: 'Go Live',
    assignedRole: 'Project Manager',
    weightage: 5,
    requiresIKFApproval: true,
    requiresClientApproval: true
  }
];

// Mock projects data
const mockProjects = [
  {
    id: 1,
    name: 'E-commerce Website Redesign',
    client: 'TechCorp Inc.',
    status: 'in_progress',
    startDate: '2024-01-15',
    dueDate: '2024-06-30',
    progress: 35,
    stages: PROJECT_STAGES.map(stage => ({
      ...stage,
      assignedTo: stage.id === 1 ? 'John Smith' : stage.id === 2 ? 'Sarah Johnson' : 'TBD',
      dateStarted: stage.id <= 2 ? '2024-01-15' : null,
      dateCompleted: stage.id === 1 ? '2024-01-20' : null,
      ikfApproved: stage.id === 1,
      clientApproved: stage.id === 1,
      notes: stage.id === 1 ? 'Initial meeting completed successfully' : '',
      files: []
    }))
  },
  {
    id: 2,
    name: 'Mobile App Development',
    client: 'StartupXYZ',
    status: 'on_hold',
    startDate: '2024-02-01',
    dueDate: '2024-08-15',
    progress: 15,
    stages: PROJECT_STAGES.map(stage => ({
      ...stage,
      assignedTo: stage.id <= 2 ? 'Mike Wilson' : 'TBD',
      dateStarted: stage.id <= 2 ? '2024-02-01' : null,
      dateCompleted: null,
      ikfApproved: stage.id === 1,
      clientApproved: stage.id === 1,
      notes: stage.id === 1 ? 'Project on hold due to budget constraints' : '',
      files: []
    }))
  }
];

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockProjects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  'projects/updateProjectStatus',
  async ({ projectId, status }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { projectId, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStageApproval = createAsyncThunk(
  'projects/updateStageApproval',
  async ({ projectId, stageId, approvalType, approved }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { projectId, stageId, approvalType, approved };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  projects: [],
  isLoading: false,
  error: null,
  selectedProject: null
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        const project = state.projects.find(p => p.id === action.payload.projectId);
        if (project) {
          project.status = action.payload.status;
        }
      })
      .addCase(updateStageApproval.fulfilled, (state, action) => {
        const project = state.projects.find(p => p.id === action.payload.projectId);
        if (project) {
          const stage = project.stages.find(s => s.id === action.payload.stageId);
          if (stage) {
            if (action.payload.approvalType === 'ikf') {
              stage.ikfApproved = action.payload.approved;
            } else if (action.payload.approvalType === 'client') {
              stage.clientApproved = action.payload.approved;
            }
            
            // Recalculate progress
            const completedStages = project.stages.filter(s => s.ikfApproved && s.clientApproved);
            const totalWeightage = PROJECT_STAGES.reduce((sum, stage) => sum + stage.weightage, 0);
            const completedWeightage = completedStages.reduce((sum, stage) => {
              const stageConfig = PROJECT_STAGES.find(s => s.id === stage.id);
              return sum + (stageConfig?.weightage || 0);
            }, 0);
            
            project.progress = Math.round((completedWeightage / totalWeightage) * 100);
          }
        }
      });
  },
});

export const { setSelectedProject, clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
