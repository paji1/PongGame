import { toast } from "react-toastify";
import { messages, roommessages } from "../../types/messages"
import { member, room } from "../../types/room"
import { backendretun } from "../../types/backendreturn";

export const roomseventssetter = (roommember: backendretun | null, rooms: room[] | null, setRoomState: any , room: backendretun | null) =>
{
	console.log("entry")
	if (!rooms)
		return ;
	const rooms2 = rooms.slice()
	console.log(roommember, "warbak kayen", room)
	if (roommember)
	{	
		const changeuserproperties = (member:member, array: room[], action :string) =>
		{
			const index = array.findIndex((ob:room) => ob.id === member.roomid);
			const userindex = array[index].rooms_members.findIndex((mem:member) => mem.id === member.id);
			const back = array[index].rooms_members[userindex].user_id;
			array[index].rooms_members[userindex] = member;
			array[index].rooms_members[userindex].user_id = back;
			if (action ==="kick")
				array[index].rooms_members = array[index].rooms_members.filter((mem:member) => mem.id != member.id);
		}
		switch (roommember.action)
		{
			case "kick":
					changeuserproperties(roommember.data as member, rooms2, "kick")
					break 
			case "norm":
				changeuserproperties(roommember.data as member, rooms2, "")
				break;
			case "ownership":
				const arr = roommember.data as member[]
				changeuserproperties(arr[0], rooms2, "")
				changeuserproperties(arr[1] , rooms2, "")
				break;
		}
		setRoomState(rooms2)
		return ;
	}
	if(room)
	{
		console.log("hna", room)
		switch (room.action)
		{
			case "new":
				const newroom  = room.data as room
				rooms2.unshift(newroom)
				break ;
			case "delete":
					const newroo  = room.data as room
					setRoomState(rooms2.filter((room:room) => room.id != newroo.id));
					return;
		}
		setRoomState(rooms2);
		return ;
	}

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