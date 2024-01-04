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
		<div className="flex flex-row">
			<input value={friend} onChange={(e) => setfreind(e.target.value)} placeholder="invite a friend?" />
			<button onClick={invite}>invite</button>
		</div>
	);
};
