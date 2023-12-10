import { member, room } from "../../types/room";
import Profile from "../../assets/profile.png";
import { useContext, useState } from "react";
import { currentUser } from "../Context/AuthContext";
import { toast } from "react-toastify";

const blockAction = (userid: number, roomid : number, action: boolean) =>
{
    const how:string = action ? "POST":"PATCH"
    console.log(how)
    const data = fetch(`http://localhost:3001/chat/block?room=${roomid}&target=${userid}`, {method:how})
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
const FriendsettingItem = ({   user, roomid} : { user : member | undefined, roomid: number |undefined}) => 
{

    const [expand, setExpand] = useState(false)
    var more;
    if (typeof user == "undefined" || typeof roomid === "undefined")
        return <></>
        if (expand)
        more = 
            <div className="flex flex-col">
                {
                    user.isblocked ?
                    <button onClick={() =>blockAction(user.user_id.id, roomid, true) }>block</button>:
                    <button onClick={() =>blockAction(user.user_id.id, roomid, true)}>unblock</button>
                }
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
                </div>
                <div>
                    <button onClick={() => setExpand(!expand)}>{expand ? "less" : "more"} </button>
                </div>
            </div>
            {more}
        </div>
    )
}
const FriendSetting = ({returnbutton, room}  : {returnbutton: any, room :room|null}) => 
{
    var item;
    const user = useContext(currentUser)

    if (room?.rooms_members)
    {
            item = room.rooms_members.find((ob:member)=> ob.user_id.id !== user?.id)
    }
    return (
        <div className="flex flex-col h-full">
            <div>
           <button onClick={() => returnbutton(false)}> rja3 lchat </button>
            </div>
            <div>
                <FriendsettingItem user={item} roomid={room?.id}/>
            </div>
        </div>
    )
}
export default FriendSetting;