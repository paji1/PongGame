import { member, room } from "../../types/room";
import Profile from "../../assets/profile.png";
import { useContext, useState } from "react";
import { currentUser } from "../Context/AuthContext";
import { toast } from "react-toastify";
import { ip } from "../../network/ipaddr";

const blockAction = ( refresh:any,userid: number, roomid: number, action: boolean) => {
	const how: string = action ? "POST" : "PATCH";
	console.log(how);
	const data = fetch(`http://${ip}3001/chat/block?room=${roomid}&target=${userid}`, { method: how ,credentials: 'include',})
		.then((data) => data.json())
		.then((data) => {
			let res = data.statusCode;
			console.log(res);
			if (res === undefined)
			{
				refresh(data, null)
				toast("user blocked");

			}
			else toast.error(data.message);
		})
		.catch(() => toast.error(`block: network error`));
};
const FriendsettingItem = ({ refresh, user, roomid }: { refresh:any, user: member | undefined; roomid: number | undefined }) => {
	const [expand, setExpand] = useState(false);
	var more;
	if (typeof user == "undefined" || typeof roomid === "undefined") return <></>;
	if (expand)
		more = (
			<div className="flex flex-col">
				{!user.isblocked ? (
					<button onClick={() => blockAction(refresh, user.user_id.id, roomid, true)}>block</button>
				) : (
					<button onClick={() => blockAction(refresh, user.user_id.id, roomid, false)}>unblock</button>
				)}
			</div>
		);
	return (
		<div>
			<div className="flex flex-row border-solid border-2 gap-2">
				<div className="max-h-[75px] max-w-[75px]">
					<img src={Profile}></img>
				</div>
				<div>
					<p>{user.user_id.nickname}</p>
				</div>
				<div></div>
				<div>
					<button onClick={() => setExpand(!expand)}>{expand ? "less" : "more"} </button>
				</div>
			</div>
			{more}
		</div>
	);
};
const FriendSetting = ({refresh, returnbutton, room }: {refresh:any,  returnbutton: any; room: room | null }) => {
	var item;
	const user = useContext(currentUser);

	if (room?.rooms_members) {
		item = room.rooms_members.find((ob: member) => ob.user_id.id !== user?.id);
	}
	return (
		<div className="flex flex-col h-full">
			<div>
				<button onClick={() => returnbutton(false)}> rja3 lchat </button>
			</div>
			<div>
				<FriendsettingItem refresh={refresh} user={item} roomid={room?.id} />
			</div>
		</div>
	);
};
export default FriendSetting;
