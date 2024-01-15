import { useState } from "react";
import Writesvg from "../../assets/write.svg";
import { Socket } from "socket.io-client";


export const CreateRoom = ({ socket }: { socket: Socket }) => {
	const [clicked, click] = useState(false);
	const [type, setType] = useState("public");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	if (type !== "protected" && password.length) setPassword("");
	if (!clicked) return (
		<div className="flex h-[50px] justify-center w-full ">

		<button
					className=" w-[98%] ffont-Nova text-center border-solid border-2 text-white bg-black  shadow-buttonShadow
					`"
					onClick={() => click(true)}
					>
					create room
			</button>
	</div>
	);
	const createRoom = (e: any) => {
		e.preventDefault();
		const roomform = {
			room: -1,
			password: password,
			name: name,
			type: type,
		};

		socket.emit("CREATE", roomform);
		setPassword("");
		setName("");
		setType("public");
		click(false);
	};
	const  submitOnEnter = (event :any) =>{
		
		if (event.which === 13)
		{
			event.preventDefault(); 
			event.target.value = ""
			createRoom(event)
			return ;
		}
	}
	return (
		<div
			onClick={() => click(!clicked)}
			className="absolute inset-0  flex items-center justify-center bg-black bg-opacity-80 h-fu "
		>
			<div
				onClick={(e) => (() => e.stopPropagation())()}
				className="w-2/3 p-6 rounded-lg shadow-xl bg-background"
			>
				
		<form  onKeyDown={(e) => submitOnEnter(e)} className="flex flex-col">
			<div>
				<div >
					<p>name</p>
					<input onChange={(e) => setName(e.target.value)} placeholder="type a name" type="text"></input>
				</div>
				<p>RoomType</p>
				<select onChange={(e) => setType(e.target.value)}>
					<option value="public">public</option>
					<option value="protected">protected</option>
					<option value="private">private</option>
				</select>
			</div>
			{type === "protected" ? (
				<div >
					<p>Password</p>
					<input onChange={(e) => setPassword(e.target.value)} placeholder="***" type="password"></input>
				</div>
			) : (
				<></>
			)}
			<img alt="create room" className="h-[40px] cursor-pointer"  src={Writesvg} onClick={createRoom}></img>

		</form>
			</div>
		</div>
	)

};