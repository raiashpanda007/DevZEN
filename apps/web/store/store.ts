
import { configureStore } from '@reduxjs/toolkit';
import userstatus from './userstatus';
import templates from './Templates';
import loader from './Loader'
export const store = configureStore({
    reducer: {
        userstatus,
        templates,
        loader
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;