import React from "react";
import { room } from "../../types/room";
import FriendItem from "./FriendsItem";
import GroupItem from "./GroupItem";
import { toast } from "react-toastify";

const SideBarItemFilter = ({
	rooms,
	query,
	roomselector,
}: {
	rooms: room[] | null;
	query: string;
	roomselector: any;
}) => {
	let i = 0;
	if (!Array.isArray(rooms)) return <>tbon mok console.error</>;
	var list;
	console.log(rooms[0].messages[0]);
	if (rooms) {
		if (query.length) {
			list = rooms.map((ob: room, index: number) => {
				let group = ob.name.toLowerCase();
				let name = ob.rooms_members[0].user_id.nickname.toLowerCase();

				if (ob.roomtypeof === "chat" && name.includes(query.toLowerCase()))
					return <FriendItem selector={() => roomselector(index)} room={ob} glimpse={ob.messages[0]} />;
				else if (ob.roomtypeof !== "chat" && group.includes(query.toLowerCase())) {
					return <GroupItem selector={() => roomselector(index)} room={ob} glimpse={ob.messages[0]} />;
				} else i++;
			});
		} else {
			list = rooms.map((ob: room, index: number) => {
				if (ob.roomtypeof === "chat")
					return <FriendItem selector={() => roomselector(index)} room={ob} glimpse={ob.messages[0]} />;
				return <GroupItem selector={() => roomselector(index)} room={ob} glimpse={ob.messages[0]} />;
			});
		}
		if (i === rooms.length) toast.error("Found Nothing");
	}
	return (
		<div className="border-solid border-white border-2 flex h-full flex-col flex-auto gap-2 overflow-y-scroll">
			{list}
		</div>
	);
};

export default SideBarItemFilter;
