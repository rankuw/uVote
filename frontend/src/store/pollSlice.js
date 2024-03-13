import { createSlice } from "@reduxjs/toolkit";
import { userDetailFromToken } from "../utils/helper";

const pollSlice = createSlice({
    name: 'poll',
    initialState: {
        poll: {},
        userToken: "",
        userName: "",
        userId: "",
        isAdmin: false
    },
    reducers: {
        addPoll: (state, action) => {
            // state.poll = action.payload.pollData
            state.userToken = action.payload.accessToken
            const tokenData = userDetailFromToken(state.userToken)
            state.isAdmin = action.payload.pollData.adminId === tokenData.userId
            state.userName = tokenData.name
            state.userId = tokenData.userId
        },
        removePoll: (state) => {
            state.poll = {}
        }
    }
})

export const {addPoll, removePoll } = pollSlice.actions
export default pollSlice.reducer;
