import chatbubbleicon from "../assets/chatbubbleicon.svg";
import { Component, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import useRooms from "../hooks/useRooms";
import useMessages from "../hooks/useMessages";
import { rooms, permission, room } from "../types/room";
import { message } from "../types/messages";
import { doc } from "prettier";

const SideBar = () => {
	const [isOpen, seIsOpen] = useState(true);
	const [peopleOrRooms, setPeopleOrRooms] = useState(true);
	const toggleChatBar = () => seIsOpen(!isOpen);

	/**
	 * 	display logic
	 */

	const [userRooms, setUserRooms] = useState<rooms[] | null>(null);
	useRooms(false, setUserRooms);
	/**
	 * display logic
	 */
	return (
		<aside
			className={`${!isOpen ? "w-[50px]" : "md:w-[75%] lg:w-[50%] xl:w-[35%] w-[100%]"}
			duration-300 h-screen min-h-screen float-right flex flex-row font-pixelify
			fixed top-0 right-0`}
		>
			<div className="py-32 z-50">
				<button
					className={`bg-buttonColor border-l-2 border-y-2 border-solid
					border-textColor rounded-tl-full rounded-bl-full shadow-chatShadow
					p-2 justify-center`}
					onClick={toggleChatBar}
				>
					<img src={chatbubbleicon} alt="chat bubblei con" />
				</button>
			</div>
			<div
				className={`${!isOpen ? "hidden" : ""} duration-300 w-full z-40 h-full gap-5
				border-solid border-textColor border-l-2 shadow-chatShadow grid grid-cols-1 content-start
				items-center justify-center bg-background`}
			>
				{/* <h2 className="text-center text-xl mt-3">Your friends missed you :)</h2> */}
				<div className="text-center h-auto place-items-center mt-7">
					<div className="w-auto flex items-center justify-center">
						<SearchBar />
					</div>
				</div>
				<div id="tabs-control" className={` flex flex-row row h-9`}>
					<div
						className={`w-1/2 ${
							peopleOrRooms ? "border-t-2 border-r-2" : "border-b-2"
						} border-solid border-textColor
					cursor-pointer`}
						onClick={() => {
							setPeopleOrRooms(true);
						}}
					>
						<h3 className="flex items-center justify-center h-full">Your friends</h3>
					</div>
					<div
						className={`w-1/2 ${
							!peopleOrRooms ? "border-t-2 border-l-2" : "border-b-2"
						} border-solid border-textColor
					cursor-pointer`}
						onClick={() => {
							setPeopleOrRooms(false);
						}}
					>
						<h3 className="flex items-center justify-center h-full">Chat rooms</h3>
					</div>
				</div>
				{!peopleOrRooms ? (
					<Groups
						groupslist={
							userRooms !== null
								? userRooms.filter((one: rooms) => one.rooms.roomtypeof !== "chat")
								: null
						}
					/>
				) : (
					<FriendsBar
						friendslist={
							userRooms !== null
								? userRooms.filter((one: rooms) => one.rooms.roomtypeof === "chat")
								: null
						}
					/>
				)}
			</div>
		</aside>
	);
};

const Groups = ({ groupslist }: { groupslist: rooms[] | null }) => {
	let list;
	const [select, setSelect] = useState<number>(-1);
	console.log("rooms", select);
	if (groupslist !== null)
		list = groupslist.map((room: rooms, index: number) => (
			<div onClick={() => setSelect(index)} key={index}>
				{room.rooms.name}
			</div>
		));
	console.log("rooms", groupslist);
	return (
		<>
			{select === -1 ? (
				list
			) : (
				<ChatBar
					room={groupslist ? groupslist[select].rooms : null}
					name={groupslist ? groupslist[select].rooms.name : null}
					selector={setSelect}
				/>
			)}
		</>
	);
};

const FriendsBar = ({ friendslist }: { friendslist: rooms[] | null }) => {
	let list;
	const [select, setSelect] = useState<number>(-1);
	console.log("friens", select);

	if (friendslist !== null)
		list = friendslist.map((room: rooms, index: number) => (
			<div onClick={() => setSelect(index)} key={index}>
				{room.rooms.rooms_members[0].user_id.nickname}
			</div>
		));
	console.log("friends", friendslist);
	return (
		<>
			{select === -1 ? (
				list
			) : (
				<ChatBar
					room={friendslist ? friendslist[select].rooms : null}
					name={friendslist ? friendslist[select].rooms.rooms_members[0].user_id.nickname : null}
					selector={setSelect}
				/>
			)}
		</>
	);
};

const ChatBar = ({ room, name, selector }: { room: room | null; name: string | null; selector: any }) => {
	let messages;
	const [roomConv, setRoomConv] = useState<message[] | null>(null);
	useMessages(room? room.id: -1, setRoomConv);
	if (roomConv)
	{
		messages = roomConv.map((ob:message, index:number) => <div key={index}> sender: {ob.senderid.nickname} message: {ob.messages}</div>)
	}

	return (
		<div>
			<button onClick={()=>selector(-1)}>return</button>
			<p>{name} </p>
			{messages}
			<MessageBar roomnumber={room ? room.id : -1}/>
		</div>
		);
};
const  MessageBar = ({roomnumber}:{roomnumber:number}) =>
{
	const [textmessage, settextmessage] = useState<string>("")
	const writing = ()=>
	{
		/**
		 * user is sending message!!!!!!!!
		 */
	}
	const setMessage = (object: any)=>
	{
		/**
		 * set limit to a message length
		 */
		// if (object.target.value.length > 5)
		// 	return ;
		settextmessage(object.target.value)
	}

	const SendMessage = (input: any)=>
	{
		input.preventDefault();
		if (!textmessage.length)
			return ;

		fetch("http://localhost:3001/chat/comunication",
		{
			method: "POST",
			headers: {
				'Content-Type':'application/json'
			  },
			body: JSON.stringify({
				destination: roomnumber.toString(),
				text: textmessage
			})
		}).then((e) => console.log(e)).catch((e) => console.log(e))
		input.target.value= ""
		settextmessage(input.target.value);
	}
	console.log("rerender")
	return <div>
		<input type="text" value={textmessage} onChange={setMessage} placeholder="write something here"></input>
		<button onClick={SendMessage} >sendMessage</button>
	</div>;
}
export default SideBar;
