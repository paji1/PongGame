import React, { useState } from "react";
import zoomicon from "../assets/zoomicon.svg";
import { BrowserRouter, Link } from "react-router-dom";

const SearchBar = () => 
{
	const [query, setquery] = useState("")
	return (
		<div className={`flex items-start h-fill`}>
			<input
				type="search"
				value={query}
				onChange={(e) => setquery(e.target.value)}
				id="search-dropdown"
				className={`rounded-tl-full rounded-bl-full
				border-y-2 border-l-2 border-r-0 border-solid border-textColor
				h-[39px] w-72 px-4 font-pixelify focus:outline-none shadow-buttonShadow
				`}
				placeholder="Search People / Chat rooms.."
				required
				></input>
				 <Link
				 	type="submit"
					 className={`bg-buttonColor text-textColor
					 rounded-tr-full rounded-br-full border-2 w-12 font-pixelify
					 border-solid border-textColor h-[39px] focus:outline-none
					 flex items-center justify-center shadow-buttonShadow
					 `}
      				to={{
        			pathname: '/search',
        			search: `?query=${query}`,
      				}}
    				>
    			</Link>		
			</div>
		)
	}


export default SearchBar;
