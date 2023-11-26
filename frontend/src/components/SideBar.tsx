import chatbubbleicon from "../assets/chatbubbleicon.svg";
import { Component, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import useRooms from "../hooks/useRooms";
import useMessages from "../hooks/useMessages";
import { rooms, permission, room } from "../types/room";
import { message } from "../types/messages";
import Profile from "../assets/profile.png"
import ViewProfile from "../assets/ViewProfile.svg"

import ChatRoomAvatar from "../assets/ChatRoomAvatar.png"



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
		
		<div className={`${!isOpen ? "w-[50px]" : "md:w-[75%] lg:w-[50%] xl:w-[35%] w-[100%]"} duration-300 h-screen min-h-screen max-h-screen flex flex-row  font-pixelify fixed top-0 right-0`}>
			<div className="py-32 z-50">
				<button className={`bg-buttonColor border-l-2 border-y-2 border-solid border-textColor rounded-tl-full rounded-bl-full shadow-chatShadow p-2 justify-center`} onClick={toggleChatBar}>
					<img src={chatbubbleicon} alt="chat bubblei con" />
				</button>
			</div>
			<div className={`${!isOpen ? "hidden" : ""}  duration-300 w-full z-40 h-full min-h-full max-h-full gap-5 border-solid border-textColor border-l-2 shadow-chatShadow flex flex-col items-center bg-background`}>
														
														
														<div className="flex text-center h-auto place-items-center mt-7 ">
															<div className="w-auto flex items-center justify-center">
																<SearchBar />
															</div>
														</div>
														
														
														<div id="tabs-control" className={` flex flex-row row h-9 w-full`}>
															<div className={`w-1/2 ${ peopleOrRooms ? "border-t-2 border-r-2" : "border-b-2" } border-solid border-textColor cursor-pointer`} onClick={() => setPeopleOrRooms(true)}>
																<h3 className="flex items-center justify-center h-full">Your friends</h3>
															</div>
															<div className={`w-1/2 ${ !peopleOrRooms ? "border-t-2 border-l-2" : "border-b-2" } border-solid border-textColor cursor-pointer`} onClick={() => setPeopleOrRooms(false)}>
																<h3 className="flex items-center justify-center h-full">Chat rooms</h3>
															</div>
														</div>
														
														
														
														
														<div className=" flex flex-col overflow-scroll  h-full max-h-full w-full">
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
			</div>
		</div>
	);
};


const ListItem = ({avatar, name, glimpse, profileurl}: {avatar:any, name:string, glimpse : string, profileurl:string}) => 
{
	// (glimpse.length > 25 ) ? (glimpse = glimpse.substring(0, 20) + "...") : glimpse;
	glimpse = (glimpse.length > 25 ) ? (glimpse.substring(0, 25) + "...") : glimpse;
	name = (name.length > 25 ) ? (name.substring(0, 20) + "...") : name
	
	var profilespesefic = (<div className="flex items-center justify-center w-1/6 ">
							<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M4 9H5V10H11V9H12V8H13V2H12V1H11V0H5V1H4V2H3V8H4V9ZM5 4H6V3H7V2H9V3H10V4H11V6H10V7H9V8H7V7H6V6H5V4Z" fill="black"/>
								<path d="M14 12H13V11H2V12H1V13H0V18H2V15H3V14H4V13H11V14H12V15H13V18H15V13H14V12Z" fill="black"/>
								<path d="M16 9H17V8H18V2H17V1H16V0H15H14V3H15V4H16V5V6H15V7H14V10H16V9Z" fill="black"/>
								<path d="M19 13V12H18V11H16V14H17V15H18V18H20V13H19Z" fill="black"/>
							</svg>
						</div>)
	var invite = 		(<div className="flex items-center justify-center w-1/7 ">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect x="13" y="14" width="2" height="2" rx="1" fill="#000301"/>
								<rect x="7" y="11" width="2" height="6" rx="1" fill="#000301"/>
								<rect x="11" y="13" width="2" height="6" rx="1" transform="rotate(90 11 13)" fill="#000301"/>
								<rect x="16" y="12" width="2" height="2" rx="1" fill="#000301"/>
								<path d="M14 8V8C14 7.58326 14 7.37488 13.9655 7.19144C13.8455 6.5546 13.4245 6.01534 12.8358 5.74455C12.6662 5.66654 12.464 5.616 12.0597 5.51493L12 5.5C11.5388 5.3847 11.3082 5.32706 11.1171 5.233C10.5686 4.96315 10.1737 4.45731 10.0449 3.85979C10 3.65151 10 3.41382 10 2.93845V2" stroke="#000301" stroke-width="2" stroke-linecap="round"/>
								<path d="M3 14C3 11.4412 3 10.1618 3.61994 9.28042C3.77954 9.05351 3.96572 8.85041 4.17372 8.6763C4.98164 8 6.15442 8 8.5 8H15.5C17.8456 8 19.0184 8 19.8263 8.6763C20.0343 8.85041 20.2205 9.05351 20.3801 9.28042C21 10.1618 21 11.4412 21 14C21 16.5588 21 17.8382 20.3801 18.7196C20.2205 18.9465 20.0343 19.1496 19.8263 19.3237C19.0184 20 17.8456 20 15.5 20H8.5C6.15442 20 4.98164 20 4.17372 19.3237C3.96572 19.1496 3.77954 18.9465 3.61994 18.7196C3 17.8382 3 16.5588 3 14Z" stroke="#000301" stroke-width="2"/>
							</svg>
						</div>)
	if (profileurl == "group")
	{
		profilespesefic = <></>
		invite = <></>
	}

return (
	<div className="flex flex-row mx-2 gap-3 p-2 rounded border-solid border-textColor border-2">
				<div className=" w-1/6 justify-center  rounded">
					<img className="max-h-[75px] max-w-[75px]" src={avatar}></img>
				</div>
				<div className="flex flex-col flex-auto  gap-2 ">
					<text className=" text-center  text-ellipsis overflow-hidden text-primary text-xl">{name}</text>
					<text className="text-ellipsis overflow-hidden">{glimpse}</text>
				</div>
				{invite}
				{profilespesefic}
		</div>
	)
}

const Groups = ({ groupslist }: { groupslist: rooms[] | null }) => {
	let list;
	const [select, setSelect] = useState<number>(-1);
	console.log("rooms", select);
	if (groupslist !== null)
		list = groupslist.map((room: rooms, index: number) => (
			<ListItem avatar={ChatRoomAvatar} name={room.rooms.name} glimpse="fgdfgdfgdfgsbkfjbskjsbfkjdsbfkjbdsfjkbdsfjkbdsjkfbsdbfjkdsbkfjbsdsjkfbdjksfsbkjdbfks" profileurl="group"/>
			
		));
	console.log("rooms", groupslist);
	return (
		<>
			{select === -1 ? (
				<div className="flex flex-col flex-shrink-0  gap-2"> {list} </div>
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
			<ListItem avatar={Profile} name={room.rooms.rooms_members[0].user_id.nickname}  glimpse="fgdfgdfgdfgsbkfjbskjsbfkjdsbfkjbdsfjkbdsfjkbdsjkfbsdbfjkdsbkfjbsdsjkfbdjksfsbkjdbfks" profileurl=""/>
		));
	console.log("friends", friendslist);
	return (
		<>
			{select === -1 ? (
				<div className="flex flex-col flex-shrink-0  gap-2"> {list} </div>
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
	useMessages(room ? room.id : -1, setRoomConv);
	if (roomConv) {
		messages = roomConv.map((ob: message, index: number) => (
			<div key={index}>
				sender: {ob.senderid.nickname} message: {ob.messages}
			</div>
		));
	}

	return (
		<div>
			<button onClick={() => selector(-1)}>return</button>
			<p>{name} </p>
			{messages}
			<MessageBar roomnumber={room ? room.id : -1} />
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
export default SideBar;
