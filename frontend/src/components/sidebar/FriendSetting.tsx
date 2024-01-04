import { member, room } from "../../types/room";
import Profile from "../../assets/profile.png";
import { useContext, useState } from "react";
import { currentUser } from "../Context/AuthContext";
import { toast } from "react-toastify";
import { ip } from "../../network/ipaddr";
import { FriendsettingItem } from "./settingsAux/settingsitems";

const FriendSetting = ({ returnbutton, room }: { returnbutton: any; room: room | null }) => {
	var item;
	const user = useContext(currentUser);

	if (room?.rooms_members) {
		item = room.rooms_members.find((ob: member) => ob.user_id.id !== user?.id);
	}
	return (
		<div className="flex flex-col h-full p-2">
			<div>
				<button onClick={() => returnbutton(false)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M16 2V3H14V5H12V7H10V9H8V10H7V11H6V13H7V14H8V15H10V17H12V19H13H14V20V21H16V22H18V19H16V17H14V15H12V13H10V11H12V9H14V7H16V5H18V2H16Z"
							fill="black"
						/>
					</svg>
				</button>
			</div>
			<div>
				<FriendsettingItem user={item} roomid={room?.id} />
			</div>
		</div>
	);
};
export default FriendSetting;
