import { Socket } from "socket.io-client";
import { member } from "../../../types/room";
import { toast } from "react-toastify";
import Kicksvg from "../../../assets/kick.svg";
import Bansvg from "../../../assets/ban.svg";
import Mutesvg from "../../../assets/mute.svg";
import AdminSvg from "../../../assets/admin.svg";
import Ownersvg from "../../../assets/owner.svg";
import Leavesvg from "../../../assets/leave.svg";
import Deletesvg from "../../../assets/delete.svg";

export const MuteButton = ({ room, roomuser, socket }: { room: number; roomuser: member; socket: Socket }) =>
	roomuser.ismuted ? (
		<button
			onClick={() => {
				socket.connected
					? socket.emit("MUTE", { target: roomuser.user_id.id, room: room, What: "UNMUTE" })
					: toast.error("socket not conected");
			}}
		>
			<img title="unmute user" className="h-[30px] w-[30px]  bg-teal-600" src={Mutesvg}></img>
		</button>
	) : (
		<button
			onClick={() => {
				socket.connected
					? socket.emit("MUTE", { target: roomuser.user_id.id, room: room, What: "MUTE" })
					: toast.error("socket not conected");
			}}
		>
			<img title="mute user" className="h-[30px] w-[30px]" src={Mutesvg}></img>
		</button>
	);
export const DeleteRoom = ({ socket, returnf, room }: { socket: Socket; returnf: any; room: number }) => (
	<button
		onClick={() => {
			socket.connected
				? socket.emit("DELETE", { target: -1, room: room, What: "DELETE" })
				: toast.error("socket not conected");
			returnf(-1);
		}}
	>
		<img title="mute user" className="h-[30px] w-[30px]" src={Deletesvg}></img>
	</button>
);
export const KickButton = ({ socket, room, roomuser }: { socket: Socket; room: number; roomuser: member }) => {
	return (
		<button
			onClick={() =>
				socket.connected
					? socket.emit("KICK", { target: roomuser.user_id.id, room: room, What: "KICK" })
					: toast.error("socket not conected")
			}
		>
			<img className="h-[30px] w-[30px]" src={Kicksvg}></img>
		</button>
	);
};

export const AdminButton = ({ socket, room, roomuser }: { socket: Socket; room: number; roomuser: member }) => {
	return roomuser.permission === "admin" ? (
		<button
			title="remove admin"
			onClick={() =>
				socket.connected
					? socket.emit("OUTDIWANA", { target: roomuser.user_id.id, room: room, What: "take admin" })
					: toast.error("socket not conected")
			}
		>
			<img className="h-[30px] w-[30px]  bg-teal-600" src={AdminSvg}></img>
		</button>
	) : (
		<button
			onClick={() =>
				socket.connected
					? socket.emit("INDIWANA", { target: roomuser.user_id.id, room: room, What: "give admin" })
					: toast.error("socket not conected")
			}
		>
			<img title="make admin" className="h-[30px] w-[30px]" src={AdminSvg}></img>
		</button>
	);
};

export const BanButton = ({ socket, room, roomuser }: { socket: Socket; room: number; roomuser: member }) => {
	return roomuser.isBanned ? (
		<button
			onClick={() =>
				socket.connected
					? socket.emit("BAN", { target: roomuser.user_id.id, room: room, What: "UNBAN" })
					: toast.error("socket not conected")
			}
		>
			<img title="unban user " className="h-[30px] w-[30px]  bg-teal-600" src={Bansvg}></img>
		</button>
	) : (
		<button
			onClick={() =>
				socket.connected
					? socket.emit("BAN", { target: roomuser.user_id.id, room: room, What: "BAN" })
					: toast.error("socket not conected")
			}
		>
			<img title="ban user" className="h-[30px] w-[30px]" src={Bansvg}></img>
		</button>
	);
};
export const OwnershipButton = ({ socket, room, roomuser }: { socket: Socket; room: number; roomuser: member }) => (
	<button
		onClick={() =>
			socket.connected
				? socket.emit("LWERT", { target: roomuser.user_id.id, room: room, What: "LWERT" })
				: toast.error("socket not conected")
		}
	>
		<img title="make owner" className="h-[30px] w-[30px]" src={Ownersvg}></img>
	</button>
);

export const LeaveButton = ({
	returnf,
	socket,
	room,
	roomuser,
}: {
	returnf: any;
	socket: Socket;
	room: number;
	roomuser: member;
}) => (
	<button
		onClick={() => {
			socket.connected
				? socket.emit("LEAVE", { target: roomuser.user_id.id, room: room, What: "LEAVE" })
				: toast.error("socket not conected");
			returnf(-1);
		}}
	>
		<img title="leave user" className="h-[30px] w-[30px]" src={Leavesvg}></img>
	</button>
);
