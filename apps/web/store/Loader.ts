import { createSlice } from "@reduxjs/toolkit";

const intialState = {
    isLoading: false,
    lodingMessage: "Loading ... ",
    
}


const loaderSlice = createSlice({
    name: "loader",
    initialState: intialState,
    reducers: {
        loadinghandler: (state, action) => {
            state.isLoading = true;
            state.lodingMessage = action.payload;
        },
        
    }
})

export const { loadinghandler } = loaderSlice.actions;
export default loaderSlice.reducer;