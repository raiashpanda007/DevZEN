
import { configureStore } from '@reduxjs/toolkit';
import userstatus from './userstatus';
export const store = configureStore({
    reducer: {
        userstatus,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;