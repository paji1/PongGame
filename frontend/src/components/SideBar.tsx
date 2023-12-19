import { useContext, useEffect, useState } from "react";
import { ToggleSidBar } from "./sidebar/ToggleSidBar";
import { HoverDiv } from "./Common";
import ChatSearchBar from "./sidebar/ChatSearchBar";
import SideBarItemFilter from "./sidebar/SideBarItemFilter";
import { member, room } from "../types/room";
import useRooms from "../hooks/useRooms";
import ChatBar from "./sidebar/ChatBar";
import { messages, roommessages } from "../types/messages";
import useMessages from "../hooks/useMessages";
import { SocketContext } from "./Context/SocketContext";
import { toast } from "react-toastify";
import { backendretun } from "../types/backendreturn";
import { ip } from "../network/ipaddr";
import { update } from "./sidebar/updater";
import { currentUser } from "./Context/AuthContext";
import {  Socket} from 'socket.io-client';


const SideBar = () => {
	const socket = useContext(SocketContext);
	const user = useContext(currentUser)
	const [isOpen, seIsOpen] = useState(false);
	const [searchSelection, setSearchSelection] = useState(1);
	const [searchText, setSearchText] = useState("");
	const [chatSelector, setChatSelector] = useState(-1);
	const [roomsState, setRoomsState] = useState<room[] | null>(null);
	const [chatState, setChatState] = useState<roommessages[] | null>(null);
	
	
	const friendroom = Array.isArray(roomsState) ? roomsState.filter((room: room) => room.roomtypeof === "chat") : null;
	const grouproom = Array.isArray(roomsState) ? roomsState.filter((room: room) => room.roomtypeof !== "chat") : null;
	useMessages(false, setChatState);
	useRooms(false, setRoomsState);
	useEffect(()=> {	
		roomsState?.map((ob:room) => socket.emit("JOIN", ob.id))
	}, [roomsState])
	const currentchat = Array.isArray(chatState) ? chatState.find((ob: roommessages) => ob.id === chatSelector) : null;
	const currentroom = Array.isArray(roomsState) ? roomsState.find((ob: room) => ob.id === chatSelector) : null;
	socket.off("ACTION").on("ACTION", (data) => update(data, roomsState, setRoomsState, chatState, setChatState, user))
	socket.off("ChatError").on("ChatError", (data) => toast.error(data));
	socket.off("NOTIFY").on("NOTIFY", (data) => toast.error(data));

	const pajination = (message: roommessages) =>
	{
		if (chatState === null)
			return ;
		const newstate = chatState.slice();
		
		const roomessg = newstate.find((on:roommessages) => on.id === message.id);
		const index = newstate.findIndex((on:roommessages) => on.id === message.id);

		if (roomessg === undefined)
			{
				return;
			}
		console.log(roomessg, "oldest");
		roomessg.messages = roomessg.messages.concat(message.messages);
		newstate[index] = roomessg;
		setChatState(newstate);
	} 
	const toggleChatBar = () => seIsOpen(!isOpen);
	const RenderOption = () => {
		if (chatSelector !== -1)
			return (
				<ChatBar
					pajinationf={pajination}
					roomselector={setChatSelector}
					room={typeof currentroom === "undefined" ? null : currentroom}
					conversation={typeof currentchat === "undefined" ? null : currentchat}
				/>
			);
		switch (searchSelection) {
			case 0:
				return <SideBarItemFilter rooms={roomsState} query={searchText} roomselector={setChatSelector} />;
			case 1:
				return <SideBarItemFilter rooms={friendroom} query="" roomselector={setChatSelector} />;
			case 2:
				return (
					<>
						<CreateRoom socket={socket}/>
						<SideBarItemFilter rooms={grouproom} query="" roomselector={setChatSelector} />
					</>
				);
		}
	};
	return (
		<>
			{isOpen && <HoverDiv toggleChatBar={toggleChatBar} />}

			<ToggleSidBar isOpen={isOpen} setIsOpen={toggleChatBar} />

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

					<div className={`flex-1 min-h-[100px] border-solid border-blue-500 border-2`}>{RenderOption()}</div>
				</div>
			</section>
		</>
	);
};

const CreateRoom = ({socket}: {socket: Socket}) => {
	const [clicked, click] = useState(false);
	const [type, setType] = useState("public");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	if (type !== "protected" && password.length) setPassword("");
	if (!clicked) return <button onClick={() => click(true)}>Create new Room</button>;
	const createRoom = (e: any) => {
		e.preventDefault();
		const roomform = {
			password: password,
			name: name,
			type: type,
		};
		
		socket.emit("NEW", roomform)
		setPassword("");
		setName("");
		setType("public");
		click(false);
	};
	return (
		<form className="flex flex-col">
			<div className="flex flex-row">
				<div className="flex flex-row">
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
				<div className="flex flex-row">
					<p>Password</p>
					<input onChange={(e) => setPassword(e.target.value)} placeholder="***" type="password"></input>
				</div>
			) : (
				<></>
			)}
			<button onClick={createRoom}> Create </button>
			<button onClick={() => click(false)}>dismiss</button>
		</form>
	);
};

export default SideBar;
