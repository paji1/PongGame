import React, { useContext } from "react";
import { useState } from "react";
import { room } from "../../types/room";
import { message } from "../../types/messages";
import useMessages from "../../hooks/useMessages";
import { toast } from "react-toastify";
import { currentUser, CurrentUser} from "../../components/Context/AuthContext"
import { log } from "console";

const ChatBar = ({ roomselector, room }: { roomselector: any; room: room | null }) => {
	let srcRoom: room | null = room ? room : null;
	let messages;
	const [roomConv, setRoomConv] = useState<message[] | null>(null);
	console.log(room);

	const user: CurrentUser | null =  useContext(currentUser);

	useMessages(srcRoom ? srcRoom.id : -1, setRoomConv);
	if (roomConv)
		messages = roomConv.map((obj, index) => { 
	console.log("malmamak", obj.senderid.id, user?.id);
	
			return (

				<div className={`flex  ${user?.id === obj.senderid.id ? "flex-row-reverse" :  "flex-row"} border-solid   border-2`} key={index}>
				{index} {obj.messages} : {obj.sender_id}
				</div>
			)
			});
	return (
		<div className="flex flex-col h-full">
			<div className="bg-white">
				<button onClick={() => roomselector(-1)}>rja3lor</button>
			</div>
			<div  className="  flex overflow-y-scroll   flex-col-reverse basis-full  ">
				{messages}
			</div>
			<div className="bg-gray-600">
				<MessageBar roomnumber={srcRoom ? srcRoom.id : -1} />
			</div>
		</div>
	);
};
const MessageBar = ({ roomnumber }: { roomnumber: number }) => {
	const [textmessage, settextmessage] = useState<string>("");
	const writing = () => {
		/**
		 * user is sending message!!!!!!!!
		 */
	};
	const setMessage = (object: any) => {

		settextmessage(object.target.value);
	};

	const SendMessage = (input: any) => {
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
	};
	console.log("rerender");
	return (
		<div>
			<input type="text" value={textmessage} onChange={setMessage} placeholder="write something here"></input>
			<button onClick={SendMessage}>sendMessage</button>
		</div>
	);
};
export default ChatBar;
