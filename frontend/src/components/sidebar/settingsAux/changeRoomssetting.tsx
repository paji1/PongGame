import { useContext, useState } from "react";
import { room } from "../../../types/room";
import { toast } from "react-toastify";
import { SocketContext } from "../../Context/SocketContext";


export const ChangeRoomType = ({ room }: { room: room | null }) => {
	const socket = useContext(SocketContext)
	const [clicked, click] = useState(false);
	const [type, setType] = useState("public");
	const [password, setPassword] = useState("");
	const [name, setName] = useState<string | null>(room ? room.name : "");
	if (type !== "protected" && password.length) setPassword("");
	if (!clicked) return <button onClick={() => click(true)}>Modify Room</button>;
	const createRoom = (e: any) => {
		e.preventDefault();
		const roomform = {
			room:room?.id,
			password: password,
			name: name,
			type: type,
		};
		console.log()
		socket.emit("MOD", roomform)

        toast.error("youforgot to set")
		setPassword("");
		setName("");
		setType("public");
	};
	return (
		<form className="flex flex-col">
			<div className="flex flex-row">
				<div className="flex flex-row">
					<p>name</p>
					<input
						value={name ? name : ""}
						onChange={(e) => setName(e.target.value)}
						placeholder="type a name"
						type="text"
					></input>
				</div>
				<p>RoomType</p>
				<select onChange={(e) => setType(e.target.value)}>
					<option value="public">public</option>
					<option value="protected">protected</option>
					<option value="private">private</option>
				</select>
			</div>
			{type === "protected" ? (
				<div className="flex flex-row">
					<p>Password</p>
					<input onChange={(e) => setPassword(e.target.value)} placeholder="***" type="password"></input>
				</div>
			) : (
				<></>
			)}
			<button onClick={createRoom}> modify </button>
			<button onClick={() => click(false)}>dismiss</button>
		</form>
	);
};