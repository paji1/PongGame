import React, { useContext } from "react";
import { useState } from "react";
import { room } from "../../types/room";
import { SocketMessage, messages, roommessages } from "../../types/messages";
import useMessages from "../../hooks/useMessages";
import { toast } from "react-toastify";
import { currentUser, CurrentUser} from "../../components/Context/AuthContext"
import { log } from "console";
import { SocketContext } from "../Context/SocketContext";
import RoomSettings from "./RoomSettings";
import FriendSetting from "./FriendSetting";

const ChatBar = ({ refresh , room, roomselector, conversation }: { refresh:any, room :room|null ,roomselector: any; conversation: roommessages | null }) => {
	let messages;
	const	[config, setConfig] = useState(false);
	const user: CurrentUser | null =  useContext(currentUser);
	if (conversation && typeof conversation.messages !== "undefined")	
	{
			messages = conversation.messages.map((obj:messages, index) => { 		
				return (
	
					<div className={`flex  ${user?.id === obj.senderid.id ? "flex-row-reverse" :  "flex-row"} border-solid   border-2`} key={index}>
					{index} {obj.messages} : {obj.senderid.id}
					</div>
				)
				});
	}
	if (config)
		return ((room?.roomtypeof !== "chat") ?<RoomSettings refresh={refresh} returnbutton={setConfig} room={room}/> : <FriendSetting returnbutton={setConfig} room={room}/>)
	return (
		<div className="flex flex-col h-full">
			<div className="bg-white flex flex-row justify-between">
				<button onClick={() => roomselector(-1)}>rja3lor</button>
				<button onClick={() => setConfig(true)}> config </button>
				<button></button>
			</div>
			<div  className="  flex overflow-y-scroll   flex-col-reverse basis-full  ">
				{messages}
			</div>
			<div className="bg-gray-600">
				<MessageBar roomnumber={conversation ? conversation.id : -1} />
			</div>
		</div>
	);
};
const MessageBar = ({ roomnumber }: { roomnumber: number }) => {
	const socket = useContext(SocketContext)

	const [textmessage, settextmessage] = useState<string>("");
	const writing = () => {
		/**
		 * user is sending message!!!!!!!!
		 */
	};
	const setMessage = (object: any) => {

		settextmessage(object.target.value);
	};
	const sendSocket = (input: any) => {
		input.preventDefault();
		if (!textmessage.length) return;
		const messsage: SocketMessage = {
			Destination : roomnumber,
			Message: textmessage
		}
		socket.emit("chat", messsage)
		
		input.target.value = "";
		settextmessage(input.target.value);
	};
	const SendHttp = (input: any) => {
		input.preventDefault();
		if (!textmessage.length) return;

		fetch(`http://localhost:3001/chat/comunication?room=${roomnumber}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				destination: roomnumber.toString(),
				text: textmessage,
			}),
		})
		.then((e:any) => {
			console.log(e)
			if ((e.status >= 400) )
				toast.error(`code: ${e.status} - ${e.statusText}`)
		}
		).catch(() => toast.error(`network error`))
		
		input.target.value = "";
		settextmessage(input.target.value);
		toast.error("websocket failure message sent via http")
	};
	return (
		<form>
			<input type="text" value={textmessage} onChange={setMessage} placeholder="write something here"></input>
			<button onClick={socket.connected ? sendSocket :  SendHttp}>sendMessage</button>
		</form>
	);
};
export default ChatBar;
