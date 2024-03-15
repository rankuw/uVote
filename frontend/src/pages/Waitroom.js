import io from "socket.io-client"
import { useEffect } from "react"
import { useSelector } from "react-redux"

var socket
let a = 1
const WaitRoom = () => {
    const userToken = useSelector((store) => store.poll.userToken)
    console.log(userToken, "OOOOOOOOOOOOOO", a++)
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
            console.log("Pollllllllllll upppppppppppppppppppppppp")
            console.log(data)
        })
        socket.on("connect_error", () => {
            console.log("Connection Failed")
        })
    }, [])
    return (
        <h1>{userToken}</h1>
    )
}

export default WaitRoom