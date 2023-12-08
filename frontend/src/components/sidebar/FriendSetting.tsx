import { member, room } from "../../types/room";

const FriendSetting = ({returnbutton, room}  : {returnbutton: any, room :room|null}) => 
{
    var list;
    if (room)
    {
        if (room.rooms_members)
            room.rooms_members.map((ob:member) => console.log(ob))
    }
    return (
        <div className="flex flex-col h-full">
            <div>
           <button onClick={() => returnbutton(false)}> rja3 lchat </button>
            </div>
            <div>
                friend setting
            </div>
        </div>
    )
}
export default FriendSetting;