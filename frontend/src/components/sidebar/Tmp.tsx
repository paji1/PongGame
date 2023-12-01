import { useState } from "react"
import SearchBar from "../SearchBar"
import { ToggleSidBar } from "./ToggleSidBar"
import { HoverDiv } from "../Common"
import ChatSearchBar from "./ChatSearchBar"


const TestSideBar = () => {
	const [isOpen, seIsOpen] = useState(false)
	// const [peopleOrRooms, setPeopleOrRooms] = useState(false)
	const [searchSelection, setSearchSelection] = useState(1)
	const [searchText, setSearchText] = useState("")

	const toggleChatBar = () => seIsOpen(!isOpen)

	return (
		<>
		{isOpen && (
			<HoverDiv toggleChatBar={toggleChatBar} />
		)}

		<ToggleSidBar isOpen={isOpen} setIsOpen={toggleChatBar} />

		<section
			className={`fixed inset-y-0 right-0 bg-background border-l-2 border-solid 
			sm:w-[85%] md:w-1/2 lg:w-1/2 xl:w-[35%] 2xl:w-[30%] w-[90%] transition-all duration-300
			font-pixelify
			${isOpen ? 'transform translate-x-0' : 'transform translate-x-full'}`}
		>
			<div className={`flex flex-col gap-2 h-full max-h-full min-h-full `}>
				<div className={`grid place-items-center h-[75px] min-h-[75px]`}>
					<ChatSearchBar query={setSearchText} buttonSetter={setSearchSelection} />
				</div>

				<div className={`flex flex-row row h-[50px] min-h-[50px]`}>
					<div className={`w-1/2 ${searchSelection === 1 ? "border-t-2 border-r-2" : "border-b-2"} border-solid border-textColor
					cursor-pointer`}
					onClick={() => {setSearchSelection(1)}}>
						<h3 className="flex items-center justify-center h-full">Your friends</h3>
					</div>
					<div className={`w-1/2 ${searchSelection === 2 ? "border-t-2 border-l-2" : "border-b-2"} border-solid border-textColor
					cursor-pointer`}
					onClick={() => {setSearchSelection(2)}} >
						<h3 className="flex items-center justify-center h-full">Chat rooms</h3>
					</div>
				</div>

				<div className={`flex-1 min-h-[100px] border-solid border-blue-500 border-2`}>

					
				</div>

			</div>
		</section>
		</>
	)
}

export default TestSideBar