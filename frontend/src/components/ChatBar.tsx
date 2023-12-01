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
        messages = roomConv.map((obj, index) => <div  className="border-solid border-2" key={index}>{index} {obj.messages} : {obj.sender_id}</div>)
 	
		return ( 
 		<div className="flex flex-col  h-full max-h-ful">
            <div className="bg-white">
                <button onClick={()=> roomselector(-1)}>rja3lor</button>
            </div>
            <div id="scrolable" className=" flex-wrap basis-full  min-h-0 grid overflow-y-auto">
	                {messages}
            </div>
            <div className="bg-gray-600">
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