import { useContext, useState } from "react";
import { room } from "../../../types/room";
import { SocketContext } from "../../Context/SocketContext";
import Writesvg from "../../../assets/write.svg";

export const ChangeRoomType = ({ room }: { room: room | null }) => {
	const socket = useContext(SocketContext);
	const [clicked, click] = useState(false);
	const [type, setType] = useState("public");
	const [password, setPassword] = useState("");
	const [name, setName] = useState<string | null>(room ? room.name : "");
	if (type !== "protected" && password.length) setPassword("");
	if (!clicked)
		return (
			<button
				className="  
	border-y-2 border-l-2 border-r-0 border-solid border-textColor
	h-[39px] w-40 px-4 font-pixelify focus:outline-none shadow-buttonShadow
	`"
				onClick={() => click(true)}
			>
				Modify Room
			</button>
		);
	const modRoom = (e: any) => {
		e.preventDefault();
		const roomform = {
			room: room?.id,
			password: password,
			name: name,
			type: type,
		};
		console.log();
		socket.emit("MOD", roomform);

		setPassword("");
		setName(name);
		setType(type);
	};
	// function DeleteRecordAction(id: any, event: any) {
	// 	event.stopPropagation();
	// 	console.log("n7wi mok");
	// }

	return (
		<div
			onClick={() => click(!clicked)}
			className="absolute inset-0  flex items-center justify-center bg-black bg-opacity-80 "
		>
			<div
				onClick={(e) => (() => e.stopPropagation())()}
				className="w-2/3 p-6 rounded-lg shadow-xl bg-background"
			>
				<form  className="flex flex-col  items-center">
					<div>
						<div>
							<p>New name</p>
							<input
								value={name ? name : ""}
								onChange={(e) => setName(e.target.value)}
								placeholder="type a name"
								type="text"
							></input>
						</div>
						<p>New type</p>
						<select onChange={(e) => setType(e.target.value)}>
							<option value="public">public</option>
							<option value="protected">protected</option>
							<option value="private">private</option>
						</select>
					</div>
					{type === "protected" ? (
						<div>
							<p>New Password</p>
							<input
								onChange={(e) => setPassword(e.target.value)}
								placeholder="***"
								type="password"
							></input>
						</div>
					) : (
						<></>
					)}
					<button onClick={modRoom}>
						<img alt="write" className="h-[40px]" src={Writesvg}></img>
					</button>
				</form>
			</div>
		</div>
	);
};
