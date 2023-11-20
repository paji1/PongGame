import chatbubbleicon from "../assets/chatbubbleicon.svg"
import { useState } from "react"
import SearchBar from "./SearchBar"

const ChatBar = () => {
	const [isOpen, seIsOpen] = useState(true)
	const [peopleOrRooms, setPeopleOrRooms] = useState(true)
	const toggleChatBar = () => seIsOpen(!isOpen)

	return (
		<aside className={`${!isOpen ? "w-[50px]" : "md:w-[75%] lg:w-[50%] xl:w-[35%] w-[100%]"} duration-300 h-screen min-h-screen float-right flex flex-row font-pixelify`}>
			<div className="mt-16 z-50">
				<button className={`bg-buttonColor border-l-2 border-y-2 border-solid
					border-textColor rounded-tl-full rounded-bl-full shadow-chatShadow
					p-2 justify-center top-11`}
					onClick={toggleChatBar}>
					<img src={chatbubbleicon} alt="chat bubblei con" />
				</button>
			</div>
			<div className={`${!isOpen ? "hidden" : ""} duration-300 w-full z-40 h-full gap-5
				border-solid border-textColor border-l-2 shadow-chatShadow grid grid-cols-1 content-start
				items-center justify-center`}>
				{/* <h2 className="text-center text-xl mt-3">Your friends missed you :)</h2> */}
				<div className="text-center h-auto place-items-center mt-7">
						<div className="w-auto flex items-center justify-center">
							<SearchBar />
						</div>
				</div>
				<div id="tabs-control" className={` flex flex-row row h-9`}>
					<div className={`w-1/2 ${peopleOrRooms ? "border-t-2 border-r-2" : "border-b-2"} border-solid border-textColor
					cursor-pointer`}
					onClick={() => {setPeopleOrRooms(true)}}>
						<h3 className="flex items-center justify-center h-full">Your friends</h3>
					</div>
					<div className={`w-1/2 ${!peopleOrRooms ? "border-t-2 border-l-2" : "border-b-2"} border-solid border-textColor
					cursor-pointer`}
					onClick={() => {setPeopleOrRooms(false)}} >
						<h3 className="flex items-center justify-center h-full">Chat rooms</h3>
					</div>
				</div>
				
			</div>
		</aside>
)}

const RoomsChat = () => {
	return (
		<div>

		</div>
	);
}

const FriendsChat = () => {

}

export default ChatBar