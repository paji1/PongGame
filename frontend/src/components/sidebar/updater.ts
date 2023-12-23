import { toast } from "react-toastify";
import { messages, roommessages } from "../../types/messages"
import { member, room } from "../../types/room"
import { backendretun } from "../../types/backendreturn";
import { CurrentUser } from "../Context/AuthContext";
import { ip } from "../../network/ipaddr";


export const update = (
    data : backendretun,
    roomsState: room[] | null,
    setRoomsState: any,
    chatState: roommessages[] | null,
    setchatState:any,
    user: CurrentUser | null
    ) =>
{
    if (!user)
        return ;
    if (data.region == "CHAT" && chatState && roomsState)
    {
        var newchatState = chatState.slice();
        var newroomstate = roomsState.slice();
        switch (data.action)
        {
            case "NEW":
                let newmsg = data.data as messages
                console.log(newmsg)
                let index = chatState.findIndex((ob: roommessages) => ob.id === newmsg.room_id)
    		    const msgarray = chatState[index];
    		    if (typeof msgarray.messages === "undefined")
    		        msgarray.messages = new Array(1).fill(newmsg);
    		    else
    		        msgarray.messages.unshift(newmsg);
                newchatState[index] = msgarray;
                let roomindex = newroomstate.findIndex((ob: room) => ob.id === newmsg.room_id);
                newroomstate[roomindex]["messages"] = new Array(1).fill(newmsg);
                setRoomsState(newroomstate);
                break ;
        }
        setchatState(newchatState)
    }
 
    if (data.region == "ROOM" && roomsState && chatState)
    {
        var newroomState = roomsState.slice();
        switch (data.action)
        {
            case "update":
                const member = data.data as member;
                const index = newroomState.findIndex((ob:room) => ob.id === member.roomid);
                const userindex = newroomState[index].rooms_members.findIndex((mem:member) => mem.id === member.id);
                const back = newroomState[index].rooms_members[userindex].user_id;
                newroomState[index].rooms_members[userindex] = member;
                newroomState[index].rooms_members[userindex].user_id = back;
                break ;
            case "KICK":
                const member1 = data.data as member;
                if (member1.user_id.id === user.id)
                {
                    newroomState = newroomState.filter((ob:room)=> ob.id !== member1.roomid);
                    var newchatStatetmp1 = chatState.filter((chat: roommessages)=> chat.id !== member1.roomid);
                    setchatState(newchatStatetmp1);
                }
                else
                {
                    const index = newroomState.findIndex((ob:room) => ob.id === member1.roomid);
                    newroomState[index].rooms_members = newroomState[index].rooms_members.filter((mem:member)=> mem.id !== member1.id)
                }
                break;
            case "DELETE":
                const room = data.data as room;
                const newchatStatetmp = chatState?.filter((chat:roommessages) => chat.id !== room.id);
                newroomState = newroomState.filter((ob:room)=> ob.id !== room.id);
                setchatState(newchatStatetmp);
                break ;
            case "NEW":
                const room1 = data.data as room;
                var newchatStatetmp1 = chatState?.slice();
                const messaged: roommessages = {id: room1.id, messages: new Array()}
                newchatStatetmp1 = newchatStatetmp1.concat(messaged);
                newroomState  = newroomState.concat(room1);
                setchatState(newchatStatetmp1);
                break ;
            case "MOD":
                const room2 = data.data as room
                let indexr = newroomState.findIndex((ob:room) => ob.id = room2.id)
                newroomState[indexr].name =  room2.name;
                newroomState[indexr].roomtypeof =  room2.roomtypeof;
                break ;
            case "JOIN":
                const room3 = data.data as room
                let indexer = newroomState.unshift(room3);
                getmessages(room3.id, chatState, setchatState);
                break ;
            case "status":
                const {userh, status } = data.data as {userh:string, status:string };
                console.log ("dsfdsfdsfds")
                toast( userh + "  " + status);

        }
        setRoomsState(newroomState)
    }
}

const getmessages = (room:number, chatState: roommessages[], setchatState:any ) => 
{
    {
        if (room === undefined)
        {
            toast.error("la mabghitch")
            return ;
        }
        const data = fetch(`http://${ip}3001/chat/paginate?room=${room}&offset=0`,{
            credentials: 'include'
        })
            .then((data) => data.json())
            .then((data) => {
        let res = data.statusCode;
        if (typeof res  === "undefined")
        {

           const newstate = chatState.slice();
           newstate.unshift(data);
           setchatState(newstate);
        }
        else toast.error(data.message);
    })
    .catch(() => toast.error(`network error`));
    }
}