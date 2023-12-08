import { useState } from "react";
import { member, room } from "../../types/room";
import Profile from "../../assets/profile.png";
import { toast } from "react-toastify";

const filter =(str:string) =>
{
    if (str === "participation")
        return "participant"
    return str
}
const banAction = (userid: number, roomid : number, action: boolean) =>
{
    const data = fetch(`http://localhost:3001/chat/town?room=${roomid}&target=${userid}`)
			.then((data) => data.json())
			.then((data) => {
			}
			)
			.catch(() => toast.error(`Rooms: network error`))
}
const muteAction = (userid: number, roomid : number, action: boolean) =>
{
    const how:string = action ? "POST":"PATCH"
    console.log(how)
    const data = fetch(`http://localhost:3001/chat/samaklite?room=${roomid}&target=${userid}`, {method:how})
			.then((data) => data.json())
			.then((data) => {
			}
			)
			.catch(() => toast.error(`mute: network error`))
}
const kickAction = (userid: number, roomid : number) => 
{
    const data = fetch("http://localhost:3001/chat/town")
			.then((data) => data.json())
			.then((data) => {
			}
			)
			.catch(() => toast.error(`Rooms: network error`))
}
const RoomsettingItem = ({ refresh , user, roomid} : {refresh :any ,user : member, roomid: number}) => 
{

    const [expand, setExpand] = useState(false)
    var more;
    if (expand)
        more = <div className="flex flex-col">
            {
                user.ismuted ? 
                <button onClick={() => {muteAction(user.user_id.id, roomid, false);  refresh()}}>unmute</button> :
                <button onClick={() => {muteAction(user.user_id.id, roomid, true);  refresh()}}>mute</button>

            }
            {
                user.isBanned ? 
                <button onClick={() => banAction(user.user_id.id, roomid, false)}>unban</button>:
                <button onClick={() => banAction(user.user_id.id, roomid, true)}> ban</button>

            }
            <button onClick={() => kickAction(user.user_id.id, roomid)}>kick</button>
        </div>
    return (
        <div >

            <div className="flex flex-row border-solid border-2 gap-2">
                <div className="max-h-[75px] max-w-[75px]">
                    <img src={Profile}></img>
                </div>
                <div>
                    <p>{user.user_id.nickname}</p>
                </div>
                <div>
                    <p>{filter(user.permission)}</p>
                </div>
                <div>
                    <button onClick={() => setExpand(!expand)}>{expand ? "less" : "more"} </button>
                </div>
            </div>
            {more}
        </div>
    )
}
const RoomSettings = ({refresh , returnbutton, room}  : {refresh:any ,returnbutton: any, room :room|null}) => 
{

    var list;
    const   [query, setQuery] = useState("");
    if (room)
    {
      list = room.rooms_members.map((ob:member, index:number) => {
            let nickname = ob.user_id.nickname.toLowerCase();
            if (nickname.includes(query.toLowerCase()))
                return (<RoomsettingItem refresh={refresh} user={ob} roomid={room.id}/>)
        })
    }
    const setQueryonchange = (object: any) =>
    {
		setQuery(object.target.value);
	};

    return (
        <div className="flex flex-col h-full">
            <div>
           <button onClick={() => returnbutton(false)}> rja3 lchat </button>
            </div>
            <div>
                <input type="text" value={query} onChange={setQueryonchange} placeholder="Finduser"></input>
            </div>
            <div className="flex flex-col overflow-y-scroll gap-2  ">
                {list}
            </div>
        </div>
    )
}
export default RoomSettings;