import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ip } from "../network/ipaddr";
import { room } from "../types/room";
import IUser from "../types/User";
import { Socket } from "socket.io-client";
import { SocketContext } from "../components/Context/SocketContext";
import Dashboard from "../components/Dashboard/Dashboard";



const RoomItem = ({room, socket} : {room:room, socket:Socket})  =>
{
    const [password, setPassword] = useState("")
    const joinroom = () =>
    {
        socket.emit("JOIN", {room:room.id, name:room.name, type:room.roomtypeof, password:password});
    }
    return (
        <div className='m-auto ring-black ring-2 p-4 w-full truncate' onClick={joinroom}>
            <p>{room.name}</p>
            <p>{room.roomtypeof}</p>
            <p>{new Date(room.created_at).toDateString()}</p>
            {
                room.roomtypeof === "protected" ?
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password"/>  :
                <></>
            }
            <button> join </button>
        </div>
    ) 
    

}
const UserItem = ({user} : {user: IUser}) =>
{
    const addFR = () => 
    {
        fetch(`http://${ip}3001/invite/friend?friend=${user.id}`,
        {
            method: "POST",
            credentials: 'include'
        })
        .then((data) => data.json())
        .then((data) => 
        {
            console.log(data)        
        })
    .catch(() => toast.error(`search: network error`))
    }
    return <div className='m-auto ring-black ring-2 p-4 w-full truncate'>
        <p>{user.nickname}</p>
        <p>Joined join {new Date(user.created_at).toDateString()}</p>
        <Link to={{
        			pathname: '/',
        			search: `?query=${user.nickname}`,
      				}}>visite profile</Link>
        <button onClick={addFR}>invite</button>

    </div>
}
export  const SearchWindow = () => {
    const [params] = useSearchParams()
    const [rooms, roomstate] = useState <room[] | null>(null);
    const [users, usersstate] = useState<IUser[] | null>(null);
    const [selector, setSelector] = useState(0)
    const query = params.get('query')
    const socket = useContext(SocketContext);
    useEffect(( () => {
        fetch(`http://${ip}3001/chat/search/${query}`,
		{
            credentials: 'include'
		})
        .then((data) => data.json())
        .then((data) => 
        {
            console.log(data)
            
            if (Array.isArray(data))
            roomstate(data)
    })
    .catch(() => toast.error(`search: network error`))
    fetch(`http://${ip}3001/users/search/${query}`,
    {
        credentials: 'include'
    })
    .then((data) => data.json())
    .then((data) => 
    {
        console.log(data)
        if (Array.isArray(data))
        usersstate(data)
    
})
.catch(() => toast.error(`search: network error`))

}), [query])

    return (
            <>
            <div className="flex flex-row gap-2 gap-y-10 p-8 mt-2 max-w-[1536px] m-auto"> 
                
                <p className="border border-solid  w-[100px]">filters</p> :
                <button className={`${!selector? "bg-black text-sucessColor" : ""} border border-solid  w-[100px]`} onClick={() => setSelector(0)}> all</button>
                <button  className={`${selector == 1? "bg-black text-sucessColor" : ""} border border-solid  w-[100px] `} onClick={() => setSelector(1)}> rooms</button>
                <button className={`${selector == 2? "bg-black text-sucessColor" : ""}  border border-solid  w-[100px]`}  onClick={() => setSelector(2)}> users</button>
            </div>
        <div className="flex flex-col gap-y-10 p-8 mt-2 max-w-[1536px] m-auto" >
            {
                (rooms && (!selector || selector === 1))  ? rooms.map((ob: room) => <RoomItem socket={socket} room={ob}/>) : <></>
            }
            {
                (users&& (!selector || selector === 2)) ? users.map((ob: IUser) => <UserItem user={ob}/> ) : <></>
            }
        </div>
        </>
    )
}