
import { Socket } from "socket.io-client";
import { member } from "../../../types/room";
import { toast } from "react-toastify";



export const MuteButton = ({ room, roomuser,socket }: { room: number; roomuser: member ,socket: Socket}) =>
	roomuser.ismuted ? (
		<button
			onClick={() => {
				socket.connected ? socket.emit("MUTE", {target: roomuser.user_id.id ,room:room,What: "UNMUTE" }): toast.error("socket not conected")
			}}
		>
			unmute
		</button>
	) : (
		<button
			onClick={() => {
				socket.connected ? socket.emit("MUTE", {target: roomuser.user_id.id ,room:room,What: "MUTE" }): toast.error("socket not conected")
			}}
		>
			mute
		</button>
	);
export const DeleteRoom = ({socket, returnf  , room }: { socket: Socket, returnf:any,  room: number }) => 
(
	<button onClick={() =>{socket.connected ? socket.emit("DELETE", {target: -1,room:room,What: "DELETE" }): toast.error("socket not conected"); returnf(-1)}}>delete room</button>
)
export const KickButton = ({ socket , room, roomuser }: {socket: Socket, room: number; roomuser: member }) => 
{
	return (
		<button onClick={() => socket.connected ? socket.emit("KICK", {target: roomuser.user_id.id ,room:room,What: "KICK"}): toast.error("socket not conected")}>kick</button>
	)
}

export const AdminButton = ({ socket,room, roomuser }: {socket: Socket, room: number; roomuser: member }) =>
{

	return (
		roomuser.permission === "admin" ? (
			<button onClick={() => socket.connected ? socket.emit("OUTDIWANA", {target: roomuser.user_id.id ,room:room, What: "take admin"}): toast.error("socket not conected")}>revoke admin right</button>
			) : (
				<button onClick={() =>  socket.connected ? socket.emit("INDIWANA", {target: roomuser.user_id.id,room:room,What: "give admin"}): toast.error("socket not conected")}>make admin</button>
			)
	);
}

export const BanButton = ({ socket,room, roomuser }: {socket: Socket ,room: number; roomuser: member }) =>
{
	return (
		roomuser.isBanned ? (
			<button onClick={() => socket.connected ? socket.emit("BAN", {target: roomuser.user_id.id ,room:room, What: "UNBAN"}): toast.error("socket not conected")}>unban</button>
			) : (
				<button onClick={() => socket.connected ? socket.emit("BAN", {target: roomuser.user_id.id , room:room, What: "BAN"}): toast.error("socket not conected")}> ban</button>
				)
			);
				
}
export const OwnershipButton = ({ socket, room, roomuser }: { socket: Socket, room: number; roomuser: member }) => (
	<button onClick={() => socket.connected ? socket.emit("LWERT", {target: roomuser.user_id.id ,room:room, What: "LWERT"}): toast.error("socket not conected")}>give owner</button>
)


export const LeaveButton = ({ returnf, socket ,room, roomuser }: {returnf:any, socket: Socket, room: number; roomuser: member }) => (
	<button onClick={() => {socket.connected ? socket.emit("LEAVE", {target: roomuser.user_id.id ,room:room, What: "LEAVE"}): toast.error("socket not conected"); returnf(-1)}}>leave room</button>
);