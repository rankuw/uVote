import { configureStore } from "@reduxjs/toolkit"
import pollReducer from "./pollSlice"

const appStore = configureStore({
    reducer: {
        poll: pollReducer
    }
})

export default appStore;