import React, { useContext } from "react";
import { room } from "../../types/room";
import FriendItem from "./FriendsItem";
import GroupItem from "./GroupItem";
import { toast } from "react-toastify";
import { currentUser } from "../Context/AuthContext";

const SideBarItemFilter = ({
	rooms,
	query,
	roomselector,
	
}: {
	rooms: room[] | null;
	query: string;
	roomselector: any;
}) => {
	const user = useContext(currentUser);
	let i = 0;
	if (!Array.isArray(rooms)) return <>empty</>;
	var list;
	if (rooms) {
		if (query.length) {
			list = rooms.map((ob: room, index: number) => {
				let group = ob.name.toLowerCase();

				let name =
					ob.rooms_members[0].user_id.id === user?.id
						? ob.rooms_members[1].user_id.nickname.toLowerCase()
						: ob.rooms_members[0].user_id.nickname.toLowerCase();

				if (ob.roomtypeof === "chat" && name.includes(query.toLowerCase()))
					return (
						<FriendItem key={index} selector={() => roomselector(ob.id)} room={ob} glimpse={ob.messages} />
					);
				else if (ob.roomtypeof !== "chat" && group.includes(query.toLowerCase())) {
					return (
						<GroupItem key={index} selector={() => roomselector(ob.id)} room={ob} glimpse={ob.messages} />
					);
				} else i++;
			});
		} else {
			list = rooms.map((ob: room, index: number) => {
				if (ob.roomtypeof === "chat")
					return (
						<FriendItem key={index} selector={() => roomselector(ob.id)} room={ob} glimpse={ob.messages} />
					);
				return <GroupItem key={index} selector={() => roomselector(ob.id)} room={ob} glimpse={ob.messages} />;
			});
		}
	}
	return (
		<div className="border-solid border-white border-2 flex h-full flex-col flex-auto gap-2 overflow-y-scroll">
			{list}
		</div>
	);
};

export default SideBarItemFilter;
