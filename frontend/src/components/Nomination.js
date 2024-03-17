import { useState } from "react";

const Nomination = ({open, onClose, children}) => {
    console.log("CALLDEEDDDDD", open)
    return (
        <div className="flex justify-center items-center h-screen transition-colors">
            <div className={`relative flex flex-col bg-orange-300 w-1/3 h-3/5 justify-start items-center gap-6 rounded-lg ${open ? "bg-slate-600" : "hidden"}`}>
                {children}
            </div>
        </div>
    )
}


export default Nomination;