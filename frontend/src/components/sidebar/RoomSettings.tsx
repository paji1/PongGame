import { useContext, useState } from "react";
import { member, room } from "../../types/room";
import Profile from "../../assets/profile.png";
import { toast } from "react-toastify";
import { currentUser } from "../Context/AuthContext";

const filter =(str:string) =>
{
    if (str === "participation")
        return "participant"
    return str
}
const banAction = (userid: number, roomid : number, action: boolean) =>
{
    const how:string = action ? "POST":"PATCH"
    console.log(how)
    const data = fetch(`http://localhost:3001/chat/ban?room=${roomid}&target=${userid}`, {method:how})
			.then((data) => data.json())
			.then((data) => {
                let res= data.statusCode
                console.log(res)
                if (res < 400)
                    toast(data.message)
                else
                    toast.error(data.message)
            }
			)
			.catch(() => toast.error(`ban: network error`))
}
const muteAction = (userid: number, roomid : number, action: boolean) =>
{
    const how:string = action ? "POST":"PATCH"
    console.log(how)
    const data = fetch(`http://localhost:3001/chat/mute?room=${roomid}&target=${userid}`, {method:how})
			.then((data) => data.json())
			.then((data) => {
                let res= data.statusCode
                console.log(res)
                if (res < 400)
                    toast(data.message)
                else
                    toast.error(data.message)
            }
			)
			.catch(() => toast.error(`mute: network error`))
}
const kickAction = (userid: number, roomid : number) => 
{
    const how:string = "POST"

    const data = fetch(`http://localhost:3001/chat/kick?room=${roomid}&target=${userid}`, {method:how})
			.then((data) => data.json())
			.then((data) => {
                let res= data.statusCode
                console.log(res)
                if (res < 400)
                    toast(data.message)
                else
                    toast.error(data.message)
            }
			)
			.catch(() => toast.error(`kick: network error`))
}
const AdminAction = (userid: number, roomid : number, action: boolean) =>
{
    const how:string = action ? "POST":"PATCH"
    console.log(how)
    const data = fetch(`http://localhost:3001/chat/diwana?room=${roomid}&target=${userid}`, {method:how})
			.then((data) => data.json())
			.then((data) => {
                let res= data.statusCode
                console.log(res)
                if (res < 400)
                    toast(data.message)
                else
                    toast.error(data.message)
            }
			)
			.catch(() => toast.error(`member: network error`))
}
const GiveUpOwner = (userid: number, roomid : number)=>
{
    const how:string =  "PATCH"
    const data = fetch(`http://localhost:3001/chat/lwert?room=${roomid}&target=${userid}`, {method:how})
			.then((data) => data.json())
			.then((data) => {
                let res= data.statusCode
                console.log(res)
                if (res < 400)
                    toast(data.message)
                else
                    toast.error(data.message)
            }
			)
			.catch(() => toast.error(`member: network error`))
}
const LeaveRoom = (userid: number, roomid : number) =>
{
    const how:string = "DELETE"
    console.log(how)
    const data = fetch(`http://localhost:3001/chat/humans?room=${roomid}`, {method:how})
			.then((data) => data.json())
			.then((data) => {
                let res= data.statusCode
                console.log(res)
                if (res < 400)
                    toast(data.message)
                else
                    toast.error(data.message)
            }
			)
			.catch(() => toast.error(`ban: network error`))
}

const deleteRoom = (roomid : number) =>
{
    const how:string = "DELETE"
    console.log(how)
    const data = fetch(`http://localhost:3001/chat/creation?room=${roomid}`, {method:how})
			.then((data) => data.json())
			.then((data) => {
                let res= data.statusCode
                console.log(res)
                if (res < 400)
                    toast(data.message)
                else
                    toast.error(data.message)
            }
			)
			.catch(() => toast.error(`ban: network error`))
}

/**
 * 
 * @param param0 
 */
const MuteButton = ({room, roomuser}: {room: number, roomuser: member }) =>
(
            roomuser.ismuted ? 
            <button onClick={() => {muteAction(roomuser.user_id.id, room, false)}}>unmute</button> :
            <button onClick={() => {muteAction(roomuser.user_id.id, room, true)}}>mute</button>
)
const DeleteRoom = ({room}: {room: number }) =>
(
    <button onClick={() => deleteRoom(room)}>delete room</button>
)
const KickButton = ({room, roomuser}: {room: number, roomuser: member }) =>
(
    <button onClick={() => kickAction(roomuser.user_id.id, room)}>kick</button>
)
const AdminButton = ({room, roomuser}: {room: number, roomuser: member }) =>
(

    (roomuser.permission === "admin" ) ? 
    <button onClick={() => AdminAction(roomuser.user_id.id, room, false)}>revoke admin right</button>:
    <button onClick={() => AdminAction(roomuser.user_id.id, room, true)}>make admin</button>
)

const BanButton = ({room, roomuser}: {room: number, roomuser: member }) =>
(
    roomuser.isBanned ? 
    <button onClick={() => banAction(roomuser.user_id.id, room, false)}>unban</button>:
    <button onClick={() => banAction(roomuser.user_id.id, room, true)}> ban</button>
)

const OwnershipButton = ({room, roomuser}: {room: number, roomuser: member}) => 
(
    <button onClick={() => GiveUpOwner(roomuser.user_id.id, room)}>give owner</button>   
)

const LeaveButton = ({room, roomuser}: {room: number, roomuser: member}) =>
(
    <button onClick={()=> LeaveRoom(roomuser.user_id.id, room)}>leave room</button> 
)
/**
 * 
 * @param param0 
 */
const RoomsettingItem = ({ refresh , user, roomid, userPerm} : {refresh :any ,user : member, roomid: number, userPerm: member | null}) => 
{

    const [expand, setExpand] = useState(false)
    var more;
    if (expand && userPerm?.permission === "participation")
        more = (
                <div className="flex flex-col">
                    {
                        userPerm.user_id.id ===user.user_id.id ?
                        <LeaveButton room={roomid} roomuser={user}/>:
                        <></>
                    }
                </div>
                )
    console.log(userPerm, user)
    if (expand && userPerm?.permission === "owner")
    {
        more = (
            <div className="flex flex-col">
                    {
                    user.permission === "participation" ? 
                    <>
                        <KickButton room={roomid} roomuser={user}/>
                        <BanButton room={roomid} roomuser={user}/>
                        <MuteButton room={roomid} roomuser={user}/>
                        <AdminButton room={roomid} roomuser={user}/>  
                        <OwnershipButton room={roomid} roomuser={user}/>
                    </>:
                    user.permission === "admin" ?
                    <>
                        <AdminButton room={roomid} roomuser={user}/>  
                        <OwnershipButton room={roomid} roomuser={user}/>
                    </> :
                        <DeleteRoom room={roomid}/>
                    }        
            </div>
        )
    }
     if (expand && userPerm?.permission === "admin")
                more = (
                    <div className="flex flex-col">
                        {
                    user.permission === "participation" ? 
                    <>
                        <KickButton room={roomid} roomuser={user}/>
                        <BanButton room={roomid} roomuser={user}/>
                        <MuteButton room={roomid} roomuser={user}/>
                    </>:
                    user.permission === "admin" && user.user_id.id ===userPerm.user_id.id ?
                    <>
                        <AdminButton room={roomid} roomuser={user}/>  
                        </> :
                        <></>
                    }        
                    </div>
            )
    
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
const ChangeRoomType = ({room} : {room : room|null})=>
{
    const [type, setType] = useState("")
    const [password, setPassword] = useState("")
    if (type !== "protected" && password.length)
        setPassword("")
    return (
        <form className="flex flex-col">
            <div className="flex flex-row">
                <p>RoomType</p>
                <select onChange={(e) => setType(e.target.value)} >
                    <option value="public">public</option>
                    <option value="protected">protected</option>
                    <option value="private">private</option>
                </select>
            </div>
            {
                type === "protected" ?
                <div className="flex flex-row">
                    <p>Password</p>
                    <input onChange={(e)=>setPassword(e.target.value)} placeholder="***" type="password"></input>
                </div>:
                <></>
            }
            <button> change </button>

        </form>
    )
}
const RoomSettings = ({refresh , returnbutton, room}  : {refresh:any ,returnbutton: any, room :room|null}) => 
{
    const   [userState, setUserState] = useState<member | null>(null)
    const   [query, setQuery] = useState("");
    const user = useContext(currentUser)
    var list;
    if (room)
    {
      list = room.rooms_members.map((ob:member, index:number) => {
            let nickname = ob.user_id.nickname.toLowerCase();
            console.log("test123", index)
            if (user?.id === ob.user_id.id && !userState)
            {
                setUserState(ob)
                console.log(ob.permission)
            }
            if (nickname.includes(query.toLowerCase())) 
                return (<RoomsettingItem refresh={refresh} user={ob} roomid={room.id} userPerm={userState}/>)
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
                <ChangeRoomType room={room}/>
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

/**
 * if new admin ban and mute should be removed
 */