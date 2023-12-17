import React, { useContext } from "react";
import { useState } from "react";
import { room } from "../../types/room";
import { SocketMessage, messages, roommessages } from "../../types/messages";
import useMessages from "../../hooks/useMessages";
import { toast } from "react-toastify";
import { currentUser, CurrentUser } from "../../components/Context/AuthContext";
import { log } from "console";
import { SocketContext } from "../Context/SocketContext";
import RoomSettings from "./RoomSettings";
import FriendSetting from "./FriendSetting";
import { ip } from "../../network/ipaddr";


const ChatBar = ({
	refresh,
	room,
	roomselector,
	conversation,
	chatupdater
}: {
	refresh: any;
	room: room | null;
	roomselector: any;
	conversation: roommessages | null;
	chatupdater:any
}) => {
	let messages;
	const [config, setConfig] = useState(false);
	const [pajination, setpaginate] = useState(true)
	const user: CurrentUser | null = useContext(currentUser);
	if (conversation && typeof conversation.messages !== "undefined") {
		messages = conversation.messages.map((obj: messages, index) => {
			return (
				<div
					className={`flex  ${
						user?.id === obj.senderid.id ? "flex-row-reverse" : "flex-row"
					} border-solid   border-2`}
					key={index}
				>
					{index} {obj.messages} : {obj.senderid.id}
				</div>
			);
		});
	}
	if (config)
		return room?.roomtypeof !== "chat" ? (
			<RoomSettings returnf={roomselector} refresh={refresh} returnbutton={setConfig} room={room} />
		) : (
			<FriendSetting refresh={refresh} returnbutton={setConfig} room={room} />
		);
		const getMoreMessages = (room: number| undefined)=>
		{
			if (room === undefined)
			{
				toast.error("la mabghitch")
				return ;
			}
			const data = fetch(`http://${ip}3001/chat/paginate?room=${room}&offset=${conversation?.messages.length}`,{
				credentials: 'include'
			})
				.then((data) => data.json())
				.then((data) => {
			let res = data.statusCode;
			if (typeof res  === "undefined")
			{
				if (data.messages.length <= 29)
				{
					setpaginate(false);
					toast(`reached the  top`);

					return ;
				}
				chatupdater(null, data)
			}
			else toast.error(data.message);
		})
		.catch(() => toast.error(`network error`));

		}
	return (
		<div className="flex flex-col h-full">
			<div className="bg-white flex flex-row justify-between">
				<button onClick={() => roomselector(-1)}>rja3lor</button>
				<button onClick={() => setConfig(true)}> config </button>
				<button></button>
			</div>
			{pajination ?
			<button onClick={() => getMoreMessages(room?.id)}>more</button>:
			<></>
			}
			<div className="  flex overflow-y-scroll   flex-col-reverse basis-full  ">{messages}</div>
			<div className="bg-gray-600">
				<MessageBar roomnumber={conversation ? conversation.id : -1} />
			</div>
		</div>
	);
};
const MessageBar = ({ roomnumber }: { roomnumber: number }) => {
	const socket = useContext(SocketContext);

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
			Destination: roomnumber,
			Message: textmessage,
		};
		socket.emit("chat", messsage);

		input.target.value = "";
		settextmessage(input.target.value);
	};
	const SendHttp = (input: any) => {
		input.preventDefault();
		if (!textmessage.length) return;

		fetch(`http://${ip}3001/chat/comunication?room=${roomnumber}`, {
			method: "POST",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				destination: roomnumber.toString(),
				text: textmessage,
			}),
		})
			.then((e: any) => {
				if (e.status >= 400) toast.error(`code: ${e.status} - ${e.statusText}`);
			})
			.catch(() => toast.error(`network error`));
		input.target.value = "";
		settextmessage(input.target.value);
		toast.error("websocket failure message sent via http");
	};
	return (
		<form>
			<input type="text" value={textmessage} onChange={setMessage} placeholder="write something here"></input>
			<button onClick={socket.connected ? sendSocket : SendHttp}>sendMessage</button>
		</form>
	);
};
export default ChatBar;
