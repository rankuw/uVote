import { useState } from "react";

const Nomination = ({open, onClose, children}) => {
    return (
        <div className={`absolute w-1/3 h-1/2 transition-colors ${open ? "bg-slate-600" : "hidden"}`}>
            {children}
        </div>
    )
}


export default Nomination;