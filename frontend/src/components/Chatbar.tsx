import React, { useContext, useEffect, useState }  from 'react';
import { io } from 'socket.io-client';


type rooms = {
    id: number,
    title: string,
    room_type: string,
    created: string
}
function Rooms( {updated, refresh, select}: {updated: boolean, refresh: any, select:any })
{
    const [rooms , setRooms] = useState<[rooms]>();
    useEffect( () =>
    {
        console.log("hey")
        async function getRooms(){
            await fetch('http://localhost:3001/chat/rooms').then((response) => response.json())
            .then((actualData) => setRooms(actualData));
    
        }
        getRooms()
        console.log(rooms)
    }, [updated])
    const array = rooms?.map((ob:any, index) => <button key={index + 1} onClick={() => select(index + 1)}>{ob.rooms.title}</button>)
  

    return (
        <div>
        <button onClick={refresh}> Refrech </button>
        <ul>{array}</ul>
    </div>

    )
}

function Message()
{

}

function Connect({status , Do} : {status: boolean; Do : any})
{
    
    return (
        <div>
            <h1> connection: {status ? "yes" : "no"}</h1>
            <button onClick={Do}> Connect </button>
        </div>
        )

}

function Chatbar(){
    const Socket  = io('ws://localhost:3001', {autoConnect: false, withCredentials: true , transports: ["websocket"]})
    const  [status, setStatus] = useState(false)
    const [updated, setUpdated] = useState(false)
    const [selected, setSelected] = useState(0)
    
    const getConect =    async()  => {
        Socket.connect();
        Socket.on("connect", () => setStatus(true))
    }
    const refrech = () => {
        setUpdated(!updated)
    }
    const selectedroom = (i: number) => 
    {
        if (i = -1)
            return selected;
        setSelected(i);
    }

    return (
        <div>
            <Connect status={status} Do={getConect} />
            <Rooms updated={updated} refresh={refrech} select={selectedroom}/>
        </div>
    )
}
export default Chatbar;



