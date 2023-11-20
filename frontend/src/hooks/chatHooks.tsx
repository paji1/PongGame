import { useEffect, useState } from "react";
import {rooms} from '../models/chatTypes'

export function useRoom(update: boolean)
{
    const [roomList, setRoomlist] = useState<[rooms] | null>(null)
    useEffect( ()=>{
        async function fetchrooms() {
            const data = await fetch('http://localhost:3001/chat/rooms').then((response) => response.json())
            .then((actualData) => setRoomlist(actualData));
        }
        fetchrooms()
        console.log(roomList)
    }, [update])
    return roomList;
}

