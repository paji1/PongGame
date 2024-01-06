import { useState } from "react";
import { Socket } from "socket.io-client";

//this option fror private rooms only
export const InviteButton = ({ roomid, type, socket }: { roomid: number; type: string; socket: Socket }) => {
	const [friend, setfreind] = useState("");
	if (type !== "private") return <></>;
	const invite = () => {
		console.log({ target: -1, room: roomid, what: friend });
		socket.emit("INVITEROOM", { target: -1, room: roomid, What: friend });
		setfreind("");
	};
	return (
		<div className="flex flex-row justify-between">
			<input className="  text-center shadow-buttonShadow border-solid border-2 p-1 sm:w-auto w-[35%]" value={friend} onChange={(e) => setfreind(e.target.value)} placeholder="invite a friend?" />
			<button className="shadow-buttonShadow border-2 border-solid p-2 text-center" onClick={invite}>invite</button>
		</div>
	);
};
