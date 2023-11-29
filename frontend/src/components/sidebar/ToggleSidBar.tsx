export const ToggleSidBar = ({isOpen, setIsOpen}:{isOpen: Boolean, setIsOpen: any}) => (
	<button
		onClick={() => setIsOpen()}
		className={`p-2 bg-buttonColor text-textColor border-textColor border-solid transition-all duration-300
			border-b-2 border-t-2 border-l-2 focus:outline-none rounded-l-full z-20 fixed top-52 w-[40px] ${!isOpen ? "hover:w-[72px]" : ""}
			${isOpen ? "sm:right-[85%] md:right-1/2 lg:right-1/2 xl:right-[35%] 2xl:right-[30%] right-[90%]" : "right-0"}
			${false ? "animate-bounce" : ""}
		`}
	>
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g id="Bubble">
				<path id="Vector" d="M21 5V4H20V3H19V2H5V3H4V4H3V5H2V15H3V16H4V17H5V18H6V22H10V21H11V20H12V19H13V18H19V17H20V16H21V15H22V5H21ZM20 13H19V14H18V15H17V16H12V17H11V18H10V19H9V20H8V16H7V15H6V14H5V13H4V7H5V6H6V5H7V4H17V5H18V6H19V7H20V13Z" fill="black"/>
			</g>
		</svg>

	</button>
)

export const HoverDiv = ({toggleChatBar}: {toggleChatBar: any}) => (
	<div
	className="fixed inset-0 bg-textColor bg-opacity-50 transition-all duration-300"
	onClick={() => toggleChatBar()}
	aria-hidden="true"
	></div>
)
