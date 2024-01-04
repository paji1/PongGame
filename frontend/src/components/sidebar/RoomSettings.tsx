import { useContext, useState } from "react";
import { member, room } from "../../types/room";
import { currentUser } from "../Context/AuthContext";
import { SocketContext } from "../Context/SocketContext";
import { ChangeRoomType } from "./settingsAux/changeRoomssetting";
import { RoomsettingItem } from "./settingsAux/settingsitems";
import { InviteButton } from "./settingsAux/InviteUser";

const RoomSettings = ({ returnf, returnbutton, room }: { returnf: any; returnbutton: any; room: room | null }) => {
	const [query, setQuery] = useState("");
	const user = useContext(currentUser);
	const socket = useContext(SocketContext);
	var list;
	var thisuser: member | undefined;
	if (room) {
		thisuser = room.rooms_members.find((ob: member) => ob.user_id.id === user?.id);
		list = room.rooms_members.map((ob: member, index: number) => {
			let nickname = ob.user_id.nickname.toLowerCase();
			if (nickname.includes(query.toLowerCase()))
				return <RoomsettingItem returnf={returnf} user={ob} roomid={room.id} userPerm={thisuser} />;
		});
	}
	const setQueryonchange = (object: any) => {
		setQuery(object.target.value);
	};
	return (
		<div className="flex flex-col h-full p-2 gap-y-4">
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
				<div className={`flex flex-row-reverse justify-between h-fill`}>
					<input
						type="search"
						id="search-dropdown"
						onChange={setQueryonchange}
						value={query}
						className={`rounded
						border-y-2 border-l-2 border-r-0 border-solid border-textColor
						h-[39px] w-40 px-4 font-pixelify focus:outline-none shadow-buttonShadow
						`}
						placeholder="Search"
						required
					></input>
					<div>{thisuser?.permission === "owner" ? <ChangeRoomType room={room} /> : <></>}</div>
				</div>
			</div>
			<InviteButton roomid={room ? room.id : -1} type={room ? room.roomtypeof : ""} socket={socket} />
			<div className="flex flex-col overflow-y-scroll gap-2 ">{list}</div>
		</div>
	);
};
export default RoomSettings;

/**
 * if new admin ban and mute should be removed
 */
