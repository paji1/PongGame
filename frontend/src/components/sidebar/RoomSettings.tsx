import { useContext, useState } from "react";
import { member, room } from "../../types/room";
import { toast } from "react-toastify";
import { currentUser } from "../Context/AuthContext";
import { ip } from "../../network/ipaddr";
import { SocketContext } from "../Context/SocketContext";
import { Socket } from "socket.io-client";
import { ChangeRoomType } from "./settingsAux/changeRoomssetting";
import { RoomsettingItem } from "./settingsAux/settingsitems";
import { InviteButton } from "./settingsAux/InviteUser";




/**
 *
 * @param param0
 */


const RoomSettings = ({ returnf, returnbutton, room }: {returnf:any,returnbutton: any; room: room | null }) => {
	const [query, setQuery] = useState("");
	const user = useContext(currentUser);
	const socket = useContext(SocketContext)
	var list;
	var thisuser: member|undefined;
	if (room) {
		thisuser =  room.rooms_members.find((ob: member) => ob.user_id.id === user?.id)
		list = room.rooms_members.map((ob: member, index: number) => {
			let nickname = ob.user_id.nickname.toLowerCase();
			if (nickname.includes(query.toLowerCase()))
				return <RoomsettingItem returnf={returnf}  user={ob} roomid={room.id} userPerm={thisuser} />;
		});
	}
	const setQueryonchange = (object: any) => {
		setQuery(object.target.value);
	};
	return (
		<div className="flex flex-col h-full">
			<div>
				<button onClick={() => returnbutton(false)}> rja3 lchat </button>
			</div>
			<div>{thisuser?.permission === "owner" ? <ChangeRoomType room={room} /> : <></>}</div>
			<div>
				<input type="text" value={query} onChange={setQueryonchange} placeholder="Finduser"></input>
			</div>
			<InviteButton type={room  ? room.roomtypeof : ""} socket={socket}/>
			<div className="flex flex-col overflow-y-scroll gap-2  ">{list}</div>
		</div>
	);
};
export default RoomSettings;

/**
 * if new admin ban and mute should be removed
 */
