import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './slices/projectsSlice';
import usersReducer from './slices/usersSlice';
import timesheetsReducer from './slices/timesheetsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    users: usersReducer,
    timesheets: timesheetsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
