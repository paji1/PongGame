export const ToggleButton = ({isOpen, setIsOpen}:{isOpen: Boolean, setIsOpen: any}) => (
	<button
		onClick={() => setIsOpen()}
		className={`p-2 bg-errorColor text-textColor border-textColor border-solid transition-all ease-in-out duration-300
			border-b-2 border-t-2 border-l-2 focus:outline-none rounded-l-full z-20 fixed top-36 w-[40px] ${!isOpen ? "hover:w-[72px]" : ""}
			${isOpen ? "sm:right-[85%] md:right-1/2 lg:right-1/2 xl:right-[35%] 2xl:right-[30%] right-[90%]" : "right-0"}
			${false ? "animate-bounce" : ""}
		`}
	>
		
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M14 20H10V22H14V20Z" fill="black"/>
			<path d="M20 17V15H19V7H18V6H17V5H16V4H13V2H11V4H8V5H7V6H6V7H5V15H4V17H3V19H21V17H20ZM6 16H7V9H8V8H9V7H10V6H14V7H15V8H16V9H17V16H18V17H6V16Z" fill="black"/>
		</svg>


	</button>
)
