import io from "socket.io-client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Nomination from "../components/Nomination"
import { updatePoll } from "../store/pollSlice"

var socket
let a = 1
const WaitRoom = () => {
    const [nominationModal, setNominationModal] = useState(false)
    const [nomination, setNomination] = useState("")
    const [nominationList, setNominationList] = useState(["This is a nomination"])
    const dispatch = useDispatch()

    const {poll, userToken} = useSelector((store) => {
        return (store.poll)
    })

    const sendNomination = () => {
        socket.emit("nominations", {nomination})
        setNominationModal(false)
    }
    
    console.log(poll.nominations, "atdbdk")
    useEffect(() => {
        socket = io("ws://localhost:4000/polls", {
            auth: {
                token: userToken
            }
        })
        socket.on("connect", (socket) => {
            console.log(socket)
        })
        socket.on("poll_updated", (data) => {
            console.log(data, "polllllllllll")
            dispatch(updatePoll(data))
        })
        socket.on("connect_error", () => {
            console.log("Connection Failed")
        })
    }, [])
    return (
        <>
            <div className="fixed  w-screen h-screen flex justify-center items-center">
                <div className=" w-1/4 h-full flex flex-col items-center justify-between py-10">
                    <div className="flex flex-col items-center gap-3 mt-12">
                        <h1 className="text-3xl">Poll Topic</h1>
                        <p className="text-1xl">Will i get it?</p>
                        <h2 className="text-2xl">Poll Id</h2>
                        <h4>05cb611e71</h4>
                    </div>
                    <div className="">
                        <button className="rounded-md w-24 h-12 border-2 border-orange-600 mr-6">Users: {poll.participants.length}</button>
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
            </div>
            <Nomination open={nominationModal} onClose={() => setNominationModal(false)}>
                
                    <h1 className="p-6 text-3xl text-teal-700">Poll question will be here</h1>
                    <textarea onChange={(e) => setNomination(e.target.value)}class="block p-1.5 w-11/12 text-sm h-12 bg-amber-700" placeholder="Write your thoughts here..." value={nomination}></textarea>
                    <button onClick={() => {
                            sendNomination()
                            setNominationList([...nominationList, nomination])
                            setNomination("")
                        }}
                        className="rounded-md w-1/4 h-12 border-2 border-orange-600">
                            Nominate
                    </button>
                    <h1>Nominations</h1>

                    {
                        nominationList.map((nomination) => {
                            return (
                                <dev>
                                    <p>{nomination}              X</p>
                                    
                                </dev>
                            )
                        })
                    }

                    <button onClick={() => setNominationModal(false)} className="absolute right-4 top-4 text-xl border-2 rounded-lg text-white">X</button>
                
            </Nomination>
        </>
        
    )
}

export default WaitRoom