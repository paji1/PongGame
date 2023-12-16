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
import { roomseventssetter, updateMessages } from "./sidebar/updater";
import { backendretun } from "../types/backendreturn";
import { ip } from "../network/ipaddr";

const SideBar = () => {
	const socket = useContext(SocketContext);
	const [isOpen, seIsOpen] = useState(false);
	const [searchSelection, setSearchSelection] = useState(1);
	const [searchText, setSearchText] = useState("");
	const [chatSelector, setChatSelector] = useState(-1);
	const [roomsState, setRoomsState] = useState<room[] | null>(null);
	const [chatState, setChatState] = useState<roommessages[] | null>(null);
	const [roomsUpdater, updateRooms] = useState(false);
	const roomevents = (data: backendretun) =>
	{
		console.log(data)
		if (data.region === "chat")
			roomseventssetter(data, roomsState, setRoomsState , null)
		else if(data.region === "room")
			roomseventssetter(null,  roomsState, setRoomsState , data)

	}
	const messageevents = (message : messages|null , mesagat: any | null ) =>
	{
		console.log(mesagat, message)
		if (message != null)
		{
			updateMessages(message, chatState, setChatState);
			return 
		}
		if (mesagat != null)
		{
			const roomid = mesagat.id;
			const messagate = mesagat.messages as messages[]
			console.log(roomid, messagate, "mamamak");
			console.log(mesagat, "ji")
			const newmessage = chatState?.slice();
			if (newmessage === undefined)
				return ;
			const index = newmessage.findIndex((ob: roommessages) => ob.id === mesagat.id)
			console.log(index)		
			console.log("new", newmessage[index].messages.concat(messagate))	
			newmessage[index].messages =newmessage[index].messages.concat(messagate)
			setChatState(newmessage)
		}
	}
	const friendroom = Array.isArray(roomsState) ? roomsState.filter((room: room) => room.roomtypeof === "chat") : null;
	const grouproom = Array.isArray(roomsState) ? roomsState.filter((room: room) => room.roomtypeof !== "chat") : null;
	useMessages(false, setChatState);
	useRooms(roomsUpdater, setRoomsState);

	const currentchat = Array.isArray(chatState) ? chatState.find((ob: roommessages) => ob.id === chatSelector) : null;
	const currentroom = Array.isArray(roomsState) ? roomsState.find((ob: room) => ob.id === chatSelector) : null;
	socket.off("connect").on("connect", () => console.log("conected"));
	socket.off("chat").on("chat", (data: messages) => {
		messageevents(data, null)
	});
	socket.off("ChatError").on("ChatError", (data) => toast.error(data));
	const toggleChatBar = () => seIsOpen(!isOpen);
	const RenderOption = () => {
		if (chatSelector !== -1)
			return (
				<ChatBar
					chatupdater={messageevents}
					refresh={roomevents}
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
						<CreateRoom refresh={roomevents}/>
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
			font-pixelify
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

const CreateRoom = ({refresh}: {refresh:any}) => {
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
		const data = fetch("http://" + ip + "3001/chat/creation", {
		
				credentials: 'include',
		
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(roomform),
		})
			.then((data) => data.json())
			.then((data) => {
				let res = data.statusCode;
				if (res >= 400 && Array.isArray(data.message)) data.message.map((e: string) => toast.error(e));
				else if (res >= 400) toast.error(data.message);
				if (res === undefined)
				{
					refresh(data)
					toast("room created")
				}
			})
			// .catch((e) => toast.error(e.message+"niffa"));
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
