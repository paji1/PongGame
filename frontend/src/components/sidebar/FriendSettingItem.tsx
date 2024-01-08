import { useContext } from "react";
import { SocketContext } from "../Context/SocketContext";
import { member } from "../../types/room";
import { Blockbutton } from "./settingsAux/roomButtons";
import { Link } from "react-router-dom";
import AdminSvg from "../../assets/admin.svg";
import Ownersvg from "../../assets/owner.svg";
import Normalsvg from "../../assets/normal.svg";

const filter = (str: string) => {
	if (str === "admin") return AdminSvg;
	if (str === "owner") return Ownersvg;
	if (str === "participation") return Normalsvg;
	return str;
};

export const FriendsettingItem = ({ user, roomid }: { user: member | undefined; roomid: number | undefined}) => {
	const socket = useContext(SocketContext);
	if (typeof user == "undefined" || typeof roomid === "undefined")
		return <></>;
	return (
			<div className="flex flex-row border-solid border-2 p-3 gap-y-4">
				<div className=" flex flex-col items-center">
					<Link to={`/profile/${user.user_id.nickname}`}>
						<img alt="avatar" className="border-solid border-2 max-h-[75px] max-w-[75px]" src={user?.user_id.avatar}></img>
						<h1 className="m-x">{user.user_id.nickname}</h1>
					</Link>
				</div>

				<div className="flex flex-row  justify-between  m-5 w-full h-full">
					<div>
						<h1 className="h-[50px] w-[50px]" >{user.isblocked ? "blocked" : filter(user.permission)}</h1>	
					</div>
					<div>
						<Blockbutton user={user} socket={socket} roomid={roomid} />
					</div>
				</div>
			</div>
	);
};
