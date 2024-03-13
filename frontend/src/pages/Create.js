import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { addPoll } from "../store/pollSlice";

const Create = () => {
    const [noOfChoice, setNoOfChoice] = useState(0)
    const [pollName, setPollName] = useState("")
    const [userName, setUserName] = useState("")
    const {poll, userToken} = useSelector((store) => store.poll || store.userToken)
    const dispatch = useDispatch()

    const increaseCount = () => {
        setNoOfChoice(noOfChoice + 1)
    }

    const decreaseCount = () => {
        if(noOfChoice === 0){
            return;
        }
        setNoOfChoice(noOfChoice - 1)
    }

    const resetPoll = () => {
        setNoOfChoice(0)
        setPollName("")
        setUserName("")
    }

    const areFieldsValid =() => {
        if (pollName === "" || userName === "" || noOfChoice === 0){
            return false
        }
        return true
    }

    const createPoll = async () => {
        try{
            const data = await axios.post("/polls", {
                user: userName,
                question: pollName,
                noOfVotes: noOfChoice
            })
            dispatch(addPoll(data.data))
        }catch(err){
            console.log(err)
        }
    }
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <div className="w-full max-w-xs flex flex-col justify-between gap-32">
                    <from>
                        <div className="flex flex-col mb-4 gap-2">
                            <label className="text-center font-semibold">
                                Enter Poll Topic
                            </label>
                            <input type="text" className="border-2 border-black-200 rounded-md p-1" value={pollName} onChange={(e) => {
                                setPollName(e.target.value)
                            }}/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-center font-semibold">
                                Votes per participant
                            </label>
                            <div className="flex justify-around p-2 items-center">
                                <button className="rounded-full w-12 h-12 bg-red-500 text-white" onClick={decreaseCount}>-</button>
                                <h2>{noOfChoice}</h2>
                                <button className="rounded-full w-12 h-12 bg-red-500 text-white" onClick={increaseCount}>+</button>
                            </div>
                        </div>
                        <div className="flex flex-col mt-4">
                            <label className="text-center font-semibold">
                                Enter Name
                            </label>
                            <input type="text" className="border-2 border-black-200 rounded-md p-1" value={userName} onChange={(e) => {
                                setUserName(e.target.value)
                            }}/>
                        </div>
                    </from>

                <div className="flex justify-center flex-wrap gap-6">
                    <button disabled={!areFieldsValid()} onClick={createPoll}  className="px-10 py-2 rounded-lg border-solid border-2 border-amber-500 text-amber-500 w-4/5 disabled:border-neutral-500 disabled:text-neutral-500">
                        Create
                    </button>
                    <button onClick={resetPoll} className="px-10 py-2 rounded-lg border-solid border-2 border-rose-800 text-rose-800 w-4/5">
                        Start Over
                    </button>
                </div>
            </div>
            
        </div>
    )
}

export default Create;