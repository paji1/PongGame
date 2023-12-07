import { toast } from "react-toastify";
import { messages, roommessages } from "../../types/messages"
import { room } from "../../types/room"

const updateRooms = (rooms: room[]) =>
{

}

export const updateMessages = (newmsg:messages,  messages: roommessages[] | null, setChatState: any) =>
{
 
    if (!messages)
    		    return ;
    		const index = messages.findIndex((ob: roommessages) => ob.id === newmsg.room_id)
    		const msgarray = messages.find((ob: roommessages) => ob.id === newmsg.room_id)
    		if (!msgarray)
    		{
				toast.error("bingo");
    		    return 
    		}
			const  newversion = messages.slice();
    		if (typeof msgarray.messages === "undefined")
    		{
    		    msgarray.messages = new Array(1).fill(newmsg);
    		}
    		else
    		    msgarray.messages.unshift(newmsg);
    		newversion[index] = msgarray;
    		setChatState(newversion)
    		console.log(newversion, "newest")
    
}