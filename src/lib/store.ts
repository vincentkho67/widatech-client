import { configureStore } from '@reduxjs/toolkit';
import invoicesReducer from '@/features/invoices/invoicesSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      invoices: invoicesReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];