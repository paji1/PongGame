import { member, room } from "../../types/room";
import Profile from "../../assets/profile.png";
import { useContext, useState } from "react";
import { currentUser } from "../Context/AuthContext";
import { toast } from "react-toastify";
import { ip } from "../../network/ipaddr";
import { FriendsettingItem } from "./settingsAux/settingsitems";


const FriendSetting = ({ returnbutton, room }: {  returnbutton: any; room: room | null }) => {
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
				<FriendsettingItem  user={item} roomid={room?.id} />
			</div>
		</div>
	);
};
export default FriendSetting;
