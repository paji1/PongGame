import React from "react";
import { useState } from "react";
import { room, rooms } from "../types/room";
import { message } from "../types/messages";
import useMessages from "../hooks/useMessages";


 const ChatBar = ({roomselector , room}:{roomselector:any, room: rooms[] | null}) => {
    let srcRoom : room | null = room ? room[0].rooms : null;
    let messages;
    const [roomConv, setRoomConv] = useState<message[] | null>(null);
    useMessages(srcRoom ? srcRoom.id : -1 , setRoomConv);
    if (roomConv)
        messages = roomConv.map((obj, index) => <div key={index}>{index} {obj.messages} : {obj.sender_id}</div>)
 	return (
 		<div className="flex flex-col h-full max-h-ful">
            <div className="flex justify-start">
                <button onClick={()=> roomselector(-1)}>rja3lor</button>
            </div>
            <div className=" flex flex-col  h-5/6 overflow-y-scroll">
                {messages}
            </div>
            <div className="">
            <MessageBar roomnumber={srcRoom ? srcRoom.id : -1}/>
            </div >
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
		/**
		 * set limit to a message length
		 */
		// if (object.target.value.length > 5)
		// 	return ;
		settextmessage(object.target.value);
	};

	const SendMessage = (input: any) => {
		input.preventDefault();
		if (!textmessage.length) return;

		fetch("http://localhost:3001/chat/comunication", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				destination: roomnumber.toString(),
				text: textmessage,
			}),
		})
			.then((e) => console.log(e))
			.catch((e) => console.log(e));
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