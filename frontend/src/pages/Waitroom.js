import io from "socket.io-client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Nomination from "../components/Nomination"
import { updatePoll } from "../store/pollSlice"
import { useNavigate } from "react-router-dom"

var socket
let a = 1
const WaitRoom = () => {
    const [nominationModal, setNominationModal] = useState(false)
    const [nomination, setNomination] = useState("")
    const [nominationList, setNominationList] = useState(["This is a nomination"])
    const [usersModal, setUsersModal] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {poll, userToken, userId} = useSelector((store) => {
        return (store.poll)
    })
    const sendNomination = () => {
        socket.emit("nominations", {nomination})
        setNominationModal(false)
    }
    
    useEffect(() => {
        socket = io("ws://localhost:4000/polls", {
            auth: {
                token: userToken
            }
        })
        socket.on("connect", (socket) => {
            console.log("socket connected")
        })
        socket.on("poll_updated", (data) => {
            if (data.participants) {
                const found = data.participants.find((par) => {
                    return par[0] == userId
            })
                if (!found) {
                    navigate("/")
                }
            }
            dispatch(updatePoll(data))
        })
        socket.on("connect_error", () => {
            console.log("Connection Failed")
        })

    }, [])

    const removeParticipant = (userId) => {
        socket.emit("remove", {userId})
    }
    return (
        <>
            <div className="fixed  w-screen h-screen flex justify-center items-center">
                <div className=" w-1/4 h-full flex flex-col items-center justify-between py-10">
                    <div className="flex flex-col items-center gap-3 mt-12">
                        <h1 className="text-3xl">Poll Topic</h1>
                        <p className="text-1xl">Will i get it?</p>
                        <h2 className="text-2xl">Poll Id</h2>
                        <h4>{poll.pollId}</h4>
                    </div>
                    <div className="">
                        <button className="rounded-md w-24 h-12 border-2 border-orange-600 mr-6" onClick={() => {
                            setUsersModal(true)
                            }}>Users: {poll.participants.length}</button>
                        <button className="rounded-md w-24 h-12 border-2 border-sky-600" onClick={() => setNominationModal(true)}>Nominations {Object.keys(poll.nominations).length}</button>
                    </div>
                    <div className="mb-12 flex flex-col gap-4 w-full items-center">
                        <p className="text-1xl">Nominations to start</p>
                        <div className="flex flex-col gap-2 w-full items-center">
                            <button className="rounded-md w-1/2 h-12 border-2 border-orange-600">Start Poll</button>
                            <button className="rounded-md w-1/2 h-12 border-2 border-sky-600">Leave Poll</button>
                        </div>
                    </div>
                </div>
         
                <Nomination open={nominationModal} onClose={() => setNominationModal(false)}>
                    <div className="p-4 h-full w-full flex flex-col justify-between text-center items-center text-white">
                        <h1 className="p-6 text-3xl text-white">Poll question will be here</h1>
                        <textarea className="w-full" onChange={(e) => setNomination(e.target.value)}class="block p-1.5  text-sm bg-amber-700" placeholder="Write your thoughts here..." value={nomination}></textarea>
                        <button onClick={() => {
                                sendNomination()
                                setNominationList([...nominationList, nomination])
                                setNomination("")
                            }}
                            className="rounded-md  border-2 border-white w-1/2">
                                Nominate
                        </button>
                        <h1>Nominations</h1>
                        <div className="flex flex-col justify-start h-1/3 w-full">
                            {
                                nominationList.map((nomination) => {
                                    return (
                                        <dev>
                                            <p>{nomination}              X</p>
                                            
                                        </dev>
                                    )
                                })
                            }
                        </div>
                        
                        <button onClick={() => setNominationModal(false)} className="absolute right-4 top-4 text-xl border-2 rounded-lg text-white">X</button>
                    </div>
                </Nomination>
                <Nomination open={usersModal} onClose={() => setUsersModal(false)}>
                    <div className="flex flex-col items-center p-4 gap-2">
                        <h1 onClick={() => setUsersModal(false)}>Users list</h1>
                        <div className="flex flex-wrap gap-2 text-orange-400 font-bold overflow-x-auto grow overflow-auto">
                            {
                                poll.participants.map(([userId, name]) => {
                                    return <div className="p-4 border-2 border-solid relative shadow-md"> 
                                        {name}
                                        <p className="absolute top-0 right-1 text-8" onClick={() => removeParticipant(userId)}>x</p>
                                    </div>  
                                })
                            }
                        </div>
                    </div>
                    

                </Nomination>
            </div>
        </>
        
    )
}

export default WaitRoom