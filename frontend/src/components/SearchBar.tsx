import React from "react";

const SearchBar = () => (
	<form action="POST">
		<div className={`flex items-start h-fill`}>
			<input type="search" id="search-dropdown"
				className={`rounded-tl-full rounded-bl-full
				border-y-2 border-l-2 border-r-0 border-solid border-textColor
				h-[39px] w-72 px-4 font-pixelify focus:outline-none shadow-buttonShadow
			`} placeholder="Search People / Chat rooms.." required>
			</input>
			<button type="submit" className={`bg-buttonColor text-textColor
				rounded-tr-full rounded-br-full border-2 w-12 font-pixelify
				border-solid border-textColor h-[39px] focus:outline-none
				flex items-center justify-center shadow-buttonShadow
				`}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path d="M19 6V5H18V4H17V3H7V4H6V5H5V6H4V16H5V17H6V18H7V19H15V21H16V22H19V20H18V19H17V18H18V17H19V16H20V6H19ZM18 14H17V15H16V16H15V17H9V16H8V15H7V14H6V8H7V7H8V6H9V5H15V6H16V7H17V8H18V14Z" fill="#000301"/>
				</svg>
			</button>
		</div>
	</form>
)

export default SearchBar