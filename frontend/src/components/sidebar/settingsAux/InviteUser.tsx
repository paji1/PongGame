

import { useState } from "react";
import { Socket } from "socket.io-client";


//this option fror private rooms only
export const InviteButton = ({ type, socket}:{ type:string ,socket:Socket}) =>
{
    const [friend , setfreind] = useState("");
    if (type!=="private")
        return <></>
    const invite = ()=>
    {
        socket.emit("INVITE", {target:-1, room:-1, friend})
        setfreind("")
    }
    return(
        <div className="flex flex-row">
            <input value={friend} onChange={(e) => setfreind(e.target.value)} placeholder="invite a friend?"/>
            <button onClick={invite}>invite</button>
        </div>
    )
}