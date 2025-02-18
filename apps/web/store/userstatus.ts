import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
// RECOMMEND
import { Slice } from "@reduxjs/toolkit";

const userStatusSlice: Slice = createSlice({
    name: "userStatus",
    initialState: {
        isLoggedIn: false,
        username: "",
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.username = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.username = "";
        },
    },
});

export const { login, logout } = userStatusSlice.actions;
export default userStatusSlice.reducer;