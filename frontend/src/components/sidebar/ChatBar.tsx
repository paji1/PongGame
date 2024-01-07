import React, { useContext } from "react";
import { useState } from "react";
import { room } from "../../types/room";
import {  messages, roommessages } from "../../types/messages";
import { toast } from "react-toastify";
import { currentUser, CurrentUser } from "../../components/Context/AuthContext";
import { SocketContext } from "../Context/SocketContext";
import RoomSettings from "./RoomSettings";
import FriendSetting from "./FriendSetting";
import { ip } from "../../network/ipaddr";
import Sendsvg from "../../assets/send.svg"
import Datasvg from "../../assets/data.svg"
import { Link } from "react-router-dom";


const Messageitem = ({ user, messages }: { user: CurrentUser; messages: messages }) => {
	return (
		<div className={`flex   ${user?.id === messages.senderid.id ? "flex-row-reverse" : "flex-row"}     justify-between `}
		>
			<div className="w-[15%] flex justify-center ">
				<Link to={`/profile/${messages.senderid.nickname}`}>
				<img  className=" border-solid border-2 rounded-full h-[60px] w-[60px]" src={messages.senderid.avatar}></img>
				</Link>
			</div>
			<div className={`p-2 rounded-2xl border-solid  border-2 w-[80%] flex items-center ${user?.id === messages.senderid.id ? "justify-end bg-MeColor" : "justify-start bg-YouColor"}` }>
				<p className={`w-full  break-words  ${user?.id === messages.senderid.id ? "text-right" : ""}  `} >{messages.messages}</p>
			</div>
			<div className="w-[10px]"></div>
		</div>
	);
};

const ChatBar = ({
	pajinationf,
	room,
	roomselector,
	conversation,
	dopagin,
}: {
	pajinationf: any;
	room: room | null;
	roomselector: any;
	conversation: roommessages | null;
	dopagin: boolean;
}) => {
	let messages;
	const [config, setConfig] = useState(false);
	const [pajination, setpaginate] = useState(dopagin);
	const user = useContext(currentUser);

	if (conversation && typeof conversation.messages !== "undefined" && user) {
		messages = conversation.messages.map((obj: messages, index) => <Messageitem user={user} messages={obj} />);
	}
	if (config)
		return room?.roomtypeof !== "chat" ? (
			<RoomSettings returnf={roomselector} returnbutton={setConfig} room={room} />
		) : (
			<FriendSetting returnbutton={setConfig} room={room} />
		);

	const getMoreMessages = (room: number | undefined) => {
		if (room === undefined) {
			toast.error("la mabghitch");
			return;
		}
		const data = fetch(`http://${ip}3001/chat/paginate?room=${room}&offset=${conversation?.messages.length}`, {
			credentials: "include",
		})
			.then((data) => data.json())
			.then((data) => {
				let res = data.statusCode;
				if (typeof res === "undefined") {
					pajinationf(data);
					if (data.messages.length <= 29) {
						setpaginate(false);
						toast(`reached the  top`);
						return;
					}
				} else toast.error(data.message);
			})
			.catch(() => toast.error(`network error`));
	};
	return (
		<div className="flex flex-col h-full">
			<div className=" flex flex-row justify-between p-2">
				<button onClick={() => roomselector(-1)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M16 2V3H14V5H12V7H10V9H8V10H7V11H6V13H7V14H8V15H10V17H12V19H13H14V20V21H16V22H18V19H16V17H14V15H12V13H10V11H12V9H14V7H16V5H18V2H16Z"
							fill="black"
						/>
					</svg>
				</button>
				<button onClick={() => setConfig(true)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path d="M11 0H9V3H11V0Z" fill="black" />
						<path d="M4 0H2V7H4V0Z" fill="black" />
						<path d="M11 6V5H9V6H7V8H9V9H11V8H13V6H11Z" fill="black" />
						<path d="M4 10V9H2V10H0V12H2V13H4V12H6V10H4Z" fill="black" />
						<path d="M11 11H9V20H11V11Z" fill="black" />
						<path d="M4 15H2V20H4V15Z" fill="black" />
						<path d="M18 17H16V20H18V17Z" fill="black" />
						<path d="M18 0H16V9H18V0Z" fill="black" />
						<path d="M18 12V11H16V12H14V14H16V15H18V14H20V12H18Z" fill="black" />
					</svg>
				</button>
			</div>
			{pajination ? 
			<div className="flex justify-center">
				 
				<img onClick={() => getMoreMessages(room?.id)} className="h-[30px]  cursor-pointer rounded-lg " src={Datasvg}>
				</img>
			</div>
			 : null}
			<div className="  flex overflow-y-scroll   flex-col-reverse basis-full p-1 gap-y-6 ">
				{messages}
			</div>
			<div >
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
		if (!socket.connected) {
			toast.error("socket not conected");
			return;
		}
		if (!textmessage.length) return;
		const messsage = {
			target: -1,
			room: roomnumber,
			What: textmessage,
		};
		console.log(messsage);
		socket.emit("CHAT", messsage);
		input.target.value = "";
		settextmessage(input.target.value);
	};
	const  submitOnEnter = (event :any) =>{
		
		if (event.which == 13)
		{
			event.preventDefault(); 
			event.target.value = ""
			settextmessage(event.target.value)
			sendSocket(event);
			return ;
		}
	}

	return (

		<form className="h-[60px] flex flex-row  justify-between ">
			<div className="h-full w-full  flex items-center justify-center  ">
				<textarea onKeyDown={(e) => submitOnEnter(e)} className=" max-h-[3rem] min-h-[3rem]  rounded-lg w-[95%] h-[80%] break-words text-black"  value={textmessage} onChange={setMessage} placeholder="send a new message"></textarea>
			</div>
			<div className=" h-full w-[20%]   flex items-center justify-center">
				<button className=" w-[80%] h-[80%]" onClick={sendSocket}>
					<img  className="h-full w-full rounded-lg border-solid border-white border-2" src={Sendsvg}></img>
				</button>
			</div>
		</form>
	);
};
export default ChatBar;
