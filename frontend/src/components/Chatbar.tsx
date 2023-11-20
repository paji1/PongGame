import React, { useEffect, useState }  from 'react';
import {useRoom} from '../hooks/chatHooks';

type rooms = {
    id: number,
    name: string,
    roomtypeof: string,
    rooms_members: string
}

function Rooms({room_list ,setter} :{room_list : [rooms] | null , setter: (i: number)=> void } )
{
    return <></>
}

function Chatbar(){
    const [updateRooms, setUpdater] = useState<boolean>(false)
    const [room, setRoom] = useState<number>(-1)
    const rooms = useRoom(updateRooms)
    console.log(rooms)
    return (
        <>
            <Rooms room_list={rooms} setter={setRoom}/>
            <p>{room}</p>
        </>
    )
}
export default Chatbar;



