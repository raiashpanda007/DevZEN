
import { configureStore } from '@reduxjs/toolkit';
import userstatus from './userstatus';
import templates from './Templates';
export const store = configureStore({
    reducer: {
        userstatus,
        templates
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;