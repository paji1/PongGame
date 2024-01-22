import React, { useContext } from "react";
import { room } from "../../types/room";
import FriendItem from "./FriendsItem";
import GroupItem from "./GroupItem";
import { currentUser } from "../Context/AuthContext";

const SideBarItemFilter = ({
	status,
	rooms,
	query,
	roomselector,
}: {
	status: Map<string, string>
	rooms: room[] | null;
	query: string;
	roomselector: any;
}) => {
	const user = useContext(currentUser);
	if (!Array.isArray(rooms))
		return null;
	var list;
	if (rooms) {
		if (query.length) {
			list = rooms.map((ob: room, index: number) => {
				let group = ob.name.toLowerCase();
				if (ob.roomtypeof === "chat" )
					{
						let name =
					 ob.rooms_members[0]?.user_id.id === user?.id
						? ob.rooms_members[1].user_id.nickname.toLowerCase()
						: ob.rooms_members[0].user_id.nickname.toLowerCase();
						if ( name.includes(query.toLowerCase()))
							return (
							<FriendItem status={status} key={index} selector={() => roomselector(ob.id)} room={ob} glimpse={ob.messages} />);
				}
				else if (ob.roomtypeof !== "chat" && group.includes(query.toLowerCase())) {
					return (
						<GroupItem key={index} selector={() => roomselector(ob.id)} room={ob} glimpse={ob.messages} />
					);
				}
				return <></>;
			});
		} else {
			list = rooms.map((ob: room, index: number) => {
				if (ob.roomtypeof === "chat")
					return (
						<FriendItem status={status} key={index} selector={() => roomselector(ob.id)} room={ob} glimpse={ob.messages} />
					);
				return <GroupItem key={index} selector={() => roomselector(ob.id)} room={ob} glimpse={ob.messages} />;
			});
		}
	}
	return (
		<div className=" mt-2 flex h-full  flex-col flex-auto gap-4 overflow-y-scroll">
			{list}
		</div>
	);
};


export default SideBarItemFilter;
