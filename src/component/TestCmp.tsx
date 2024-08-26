import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {increment} from '../redux/bsParamSlice'

function TestCmp() {
    // const [count, setCount] = useState(0)

    const cnt = useSelector((state:any) => state.counter.bs.cnt)
    const dispatch = useDispatch()
  
    return (
      <>
            <input type="button"  onClick={(e)=>{console.log(e);dispatch(increment());}}/>
            <div>{cnt}</div>
      </>
    )
  }
  
  export default TestCmp