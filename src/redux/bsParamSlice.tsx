import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    bs:{
        spot:0,
        cnt:0
    }
}

const bsParamSlice = createSlice({
    name:'bs',
    initialState:initialState,
    reducers:{
        increment(state){
            console.log(state)
            state.bs.cnt+=1
        },
        setSpot(state, action){
            console.log(action)
            state.bs.spot = 0
        }
    }
})

export const {increment, setSpot} = bsParamSlice.actions
export default bsParamSlice.reducer
 