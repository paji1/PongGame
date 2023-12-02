import { useState } from "react";
import { ToggleSidBar } from "./sidebar/ToggleSidBar";
import { HoverDiv } from "./Common";
import ChatSearchBar from "./sidebar/ChatSearchBar";
import SideBarItemFilter from "./sidebar/SideBarItemFilter";
import { room } from "../types/room";
import useRooms from "../hooks/useRooms";
import ChatBar from "./sidebar/ChatBar";

const SideBar = () => {
	const [isOpen, seIsOpen] = useState(false);
	const [searchSelection, setSearchSelection] = useState(1);
	const [searchText, setSearchText] = useState("");
	const [chatSelector, setChatSelector] = useState(-1);
	const [roomsState, setRoomsState] = useState<room[] | null>(null);
	const friendroom = roomsState ? roomsState.filter((room: room) => room.roomtypeof === "chat") : null;
	const grouproom = roomsState ? roomsState.filter((room: room) => room.roomtypeof !== "chat") : null;
	useRooms(false, setRoomsState);
	const toggleChatBar = () => seIsOpen(!isOpen);

	const RenderOption = () => {
		switch (searchSelection) {
			case 0:
				if (chatSelector !== -1)
					return (
						<ChatBar roomselector={setChatSelector} room={roomsState ? roomsState[chatSelector] : null} />
					);
				return <SideBarItemFilter rooms={roomsState} query={searchText} roomselector={setChatSelector} />;
			case 1:
				if (chatSelector !== -1)
					return (
						<ChatBar roomselector={setChatSelector} room={friendroom ? friendroom[chatSelector] : null} />
					);
				return <SideBarItemFilter rooms={friendroom} query="" roomselector={setChatSelector} />;
			case 2:
				if (chatSelector !== -1)
					return <ChatBar roomselector={setChatSelector} room={grouproom ? grouproom[chatSelector] : null} />;
				return <SideBarItemFilter rooms={grouproom} query="" roomselector={setChatSelector} />;
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

export default SideBar;
