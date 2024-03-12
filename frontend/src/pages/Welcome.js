import { useNavigate } from "react-router-dom"

const Welcome = () => {
    const navigate = useNavigate()
    return <>
       <div className="flex flex-col h-screen items-center justify-center">
            <h1 className="mb-20 text-2xl">Welcome to uVote</h1>
            <div className="flex flex-col mt-8 h-28 justify-between">
                <button className="px-10 py-2 rounded-lg border-solid border-2 border-amber-500 text-amber-500" onClick={() => navigate("/create")}>
                    Create new poll
                </button>
                <button className="px-10 py-2 rounded-lg border-solid border-2 border-rose-800 text-rose-800" onClick={() => navigate("/join")}>
                    Join poll
                </button>
            </div>
       </div>
    </>
}

export default Welcome