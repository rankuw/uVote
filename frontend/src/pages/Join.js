import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addPoll } from "../store/pollSlice"
import { useNavigate } from "react-router-dom"

const Join = () => {
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const dataa = useSelector((store) => store.poll || store.userToken || store.isAdmin)
  
    const resetPoll = () => {
        setCode("")
        setName("")
    }
    // store {userName, userId} from token in a obj and a is admin bool in a variable in our slice.
    const enterPoll = async () => {
        try{
            const data = await axios.post("/polls/join", {
                user: name,
                pollId: code
            })
            dispatch(addPoll(data.data))
            localStorage.setItem("userInfo", JSON.stringify(data.data))
            navigate("/wait")
        }catch(err){
            console.log(err)
        }
    }

    const areFieldsValid = () => {
        if (code != "" && name != "") {
            return true
        }
        return false
    }

    return (
        <div className="w-full h-screen flex flex-col justify-start items-center gap-12 mt-24">
            <form>
                <div className="flex flex-col p-4">
                    <label className="text-center mb-2">Enter code</label>
                    <input value={code} onChange = {(e) => {
                        setCode(e.target.value)
                    }}className="rounded-lg h-10 border-indigo-500/50 border-2"></input>
                </div>
                <div className="flex flex-col p-4">
                    <label className="text-center mb-2">Enter name</label>
                    <input value={name} onChange={(e) => {
                        setName(e.target.value)
                    }} className="rounded-lg h-10 border-indigo-500/50 border-2"></input>
                </div>
            </form>
            <div className="flex flex-col gap-4 p-4">
                <button disabled={!areFieldsValid()} onClick={enterPoll} className="border-2 rounded-lg w-40 h-10 border-orange-400 disabled:border-neutral-500 disabled:text-neutral-500">Join Poll</button>
                <button onClick={resetPoll} className="border-2 rounded-lg w-40 h-10 border-indigo-500">Start Over</button>
            </div>
        </div>
    )
}

export default Join