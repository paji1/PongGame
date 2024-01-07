import { useContext, useEffect, useState } from "react";
import { ToggleSidBar } from "./sidebar/ToggleSidBar";
import { HoverDiv } from "./Common";
import ChatSearchBar from "./sidebar/ChatSearchBar";
import SideBarItemFilter from "./sidebar/SideBarItemFilter";
import {  room } from "../types/room";
import useRooms from "../hooks/useRooms";
import ChatBar from "./sidebar/ChatBar";
import { roommessages } from "../types/messages";
import useMessages from "../hooks/useMessages";
import { SocketContext } from "./Context/SocketContext";
import { toast } from "react-toastify";
import { update } from "./sidebar/updater";
import { currentUser } from "./Context/AuthContext";
import { Socket } from "socket.io-client";
import Writesvg from "../assets/write.svg";
import IUser from "../types/User";


const SideBar = ({ toogle, settogle }: { toogle: number; settogle: any }) => {
	const socket = useContext(SocketContext);
	const user = useContext(currentUser);
	const [isOpen, seIsOpen] = useState(false);
	const [searchSelection, setSearchSelection] = useState(1);
	const [searchText, setSearchText] = useState("");
	const [chatSelector, setChatSelector] = useState(-1);
	const [roomsState, setRoomsState] = useState<room[] | null>(null);
	const [chatState, setChatState] = useState<roommessages[] | null>(null);
	const [subscriberooms, setsubscriptrooms] = useState(false);
	const [newAlert, setNewAlert] = useState(false);


// this section to be moved out of this component
	const [status, setstatus] = useState<Map<string, string>>(new Map())
	useEffect(()=> {socket.emit("ONNSTATUS", {"room": -1})},[subscriberooms])
	socket.off("ON_STATUS").on("ON_STATUS", (usersstatus: IUser[]) => 
	{
		
		usersstatus.map((user:IUser)=> status.set(user.nickname, user.connection_state))
		setstatus(new Map(status));
		console.log("updateted status", status)
	})
// this section to be moved out of this component



	console.log("roomstate", roomsState,  "chatstate", chatState)
	const friendroom = Array.isArray(roomsState) ? roomsState.filter((room: room) => room.roomtypeof === "chat") : null;
	const grouproom = Array.isArray(roomsState) ? roomsState.filter((room: room) => room.roomtypeof !== "chat") : null;
	useMessages(false, setChatState);
	useRooms(false, setRoomsState);
	
	useEffect(() => {
		if ( Array.isArray(roomsState))
			roomsState?.map((ob: room) => socket.emit("ROOMSUBSCRIBE", { room: ob.id }));
	}, [roomsState,  subscriberooms, socket]);

	const currentchat = Array.isArray(chatState) ? chatState.find((ob: roommessages) => ob.id === chatSelector) : null;
	const currentroom = Array.isArray(roomsState) ? roomsState.find((ob: room) => ob.id === chatSelector) : null;
	socket.off("connect").on("connect", () => setsubscriptrooms(!subscriberooms));
	socket.off("ACTION").on("ACTION", (data) => {
		console.log("updateing", data)

		update(data, roomsState, setRoomsState, chatState, setChatState, user);
		if (data.region === "CHAT" && data.action === "NEW") setNewAlert(true);
	});
	socket.off("ChatError").on("ChatError", (data) => toast.error(data));
	socket.off("NOTIFY").on("NOTIFY", (data) => {
		toast(data);
	});

	const pajination = (message: roommessages) => {
		if (chatState === null) return;
		const newstate = chatState.slice();

		const roomessg = newstate.find((on: roommessages) => on.id === message.id);
		const index = newstate.findIndex((on: roommessages) => on.id === message.id);

		if (roomessg === undefined) {
			return;
		}
		roomessg.messages = roomessg.messages.concat(message.messages);
		newstate[index] = roomessg;
		setChatState(newstate);
	};
	const toggleChatBar = () => {
		seIsOpen(!isOpen);
		if (!isOpen) settogle(1);
		else settogle(0);
		newAlert ? setNewAlert(!newAlert) : setNewAlert(newAlert);
	};
	const RenderOption = () => {
		if (chatSelector !== -1)
			return (
				<ChatBar
					pajinationf={pajination}
					roomselector={setChatSelector}
					room={typeof currentroom === "undefined" ? null : currentroom}
					conversation={typeof currentchat === "undefined" ? null : currentchat}
					dopagin={currentchat?.messages.length === 30}
				/>
			);
		switch (searchSelection) {
			case 0:
				return <SideBarItemFilter status={status} rooms={roomsState} query={searchText} roomselector={setChatSelector} />;
			case 1:
				return <SideBarItemFilter status={status} rooms={friendroom} query="" roomselector={setChatSelector} />;
			case 2:
				return (
						<SideBarItemFilter status={status} rooms={grouproom} query="" roomselector={setChatSelector} />);
		}
	};
	return (
		<>
			{isOpen && <HoverDiv toggleChatBar={toggleChatBar} />}

			<ToggleSidBar isOpen={isOpen} isNewAlert={newAlert} setIsOpen={toggleChatBar} />

			<section
				className={`fixed inset-y-0 right-0 bg-background border-l-2 border-solid 
			sm:w-[85%] md:w-1/2 lg:w-1/2 xl:w-[35%] 2xl:w-[30%] w-[90%] transition-all duration-300
			font-pixelify z-50
			${isOpen ? "transform translate-x-0" : "transform translate-x-full"}`}
			>
				<div className={`flex flex-col gap-2 h-full max-h-full min-h-full `}>
					<div className={`grid place-items-center h-[75px] min-h-[75px]`}>
						<ChatSearchBar
							query={setSearchText}
							buttonSetter={(i: number) => {
								setSearchSelection(i);
								setChatSelector(-1);
							}}
						/>
					</div>

					<div className={`flex flex-row row h-[50px] min-h-[50px]`}>
						<div
							className={`w-1/2 ${
								searchSelection === 1 ? "border-t-2 border-r-2" : "border-b-2"
							} border-solid border-textColor
					cursor-pointer`}
							onClick={() => {
								setSearchSelection(1);
								setChatSelector(-1);
							}}
						>
							<h3 className="flex items-center justify-center h-full">Your friends</h3>
						</div>
						<div
							className={`w-1/2 ${
								searchSelection === 2 ? "border-t-2 border-l-2" : "border-b-2"
							} border-solid border-textColor
					cursor-pointer`}
							onClick={() => {
								setSearchSelection(2);
								setChatSelector(-1);
							}}
						>
							<h3 className="flex items-center justify-center h-full">Chat rooms</h3>
						</div>
					</div>
						{searchSelection === 2  && chatSelector === -1?<CreateRoom socket={socket} /> : null}
					<div className={`flex-1 min-h-[100px]  justify-center `}>
						{RenderOption()}
						</div>
				</div>
			</section>
		</>
	);
};

const CreateRoom = ({ socket }: { socket: Socket }) => {
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

export default SideBar;
