import { configureStore } from '@reduxjs/toolkit'
import bsReducer from '../redux/bsParamSlice'

export default configureStore({
    reducer: {
    //   spot: bsReducer,
      counter: bsReducer
    }
})