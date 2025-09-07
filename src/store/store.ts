import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../hooks/useAuth';
import batchesReducer from '../hooks/useBatches';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    batches: batchesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
