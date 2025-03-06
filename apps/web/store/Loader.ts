import { createSlice } from "@reduxjs/toolkit";

const intialState = {
    isLoading:false,
    lodingMessage: "Loading ... ",
    
}


const loaderSlice = createSlice({
    name: "loader",
    initialState: intialState,
    reducers: {
        loadinghandler: (state, action) => {
            state.isLoading = action.payload.isLoading;
            state.lodingMessage = action.payload.message;
        },
        
    }
})

export const { loadinghandler } = loaderSlice.actions;
export default loaderSlice.reducer;