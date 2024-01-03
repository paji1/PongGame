import React, { useState } from "react";
import MainButton from "./MainButton";
import SearchBar from "./SearchBar";
import profileplaceholder from "../assets/profileplaceholder.png";
import { useContext } from "react";
import { currentUser, CurrentUser } from "./Context/AuthContext";
import { toast } from "react-toastify";

const listItems = ["home", "about", "our-team", "button"].map((item: String, key: Number) =>
	item === "button" ? (
		<li className={`uppercase font-pixelify cursor-pointer py-2 h-auto`}>
			<MainButton name={`signin`} url={`test.com`} />
		</li>
	) : (
		<li
			key={`${key}`}
			className={`uppercase font-pixelify py-2 text-primary
			h-auto cursor-pointer lg:mr-10 md:mr-7`}
		>
			<a href={key === 0 ? "/" : "/#" + item} className="py-3 hover:text-secondary">
				{item.replace("-", " ")}
			</a>
		</li>
	),
);

interface isOpen {
	isOpen: Boolean;
}

const UnloggedNavBar: React.FC<isOpen> = (props) => (
	<nav className={props.isOpen ? "flex" : "hidden md:flex"}>
		<ul
			className={`
			flex bg-background absolute md:relative flex-col
			md:flex-row w-full text-center items-center justify-content-center
			top-9 left-0 md:top-0 md:flex
		`}
		>
			{listItems}
		</ul>
	</nav>
);

const LoggedNavBar: React.FC<isOpen> = (props) => (
	<nav className={props.isOpen ? "flex" : "hidden lg:flex"}>
		<ul
			className={`
			flex bg-background absolute md:relative flex-col
			lg:flex-row w-full text-center items-center justify-content-center
			top-9 left-0 lg:top-0 lg:flex gap-2
		`}
		>
			<li key={1} className={`uppercase font-pixelify cursor-pointer py-2 h-auto md:mr-5`}>
				<SearchBar />
			</li>
			<li key={2} className={`uppercase font-pixelify cursor-pointer py-2 h-auto`}>
				<MainButton name={`start a game`} url={`/game`} />
			</li>
		</ul>
	</nav>
);

const Navbar = () => {
	const [isOpen, setIsOpen] = useState<Boolean>(false);

	const toggleNavBar = () => {
		setIsOpen(!isOpen);
	};
	const user: CurrentUser | null = useContext(currentUser);

	return (
		<div
			className={`
		container relative m-auto p-3 top-5 flex justify-between items-center border-b-2 border-solid
		`}
		>
			<a
				href="/"
				className={`
				font-xl font-bold text-primary uppercase font-pixelify md:text-2xl text-xl
				`}
			>
				Transcendence
			</a>

			{user ? <LoggedNavBar isOpen={isOpen} /> : <UnloggedNavBar isOpen={isOpen} />}

			<div className="md:hidden">
				<button className="flex justify-center items-center" onClick={toggleNavBar}>
					<svg
						viewBox="0 0 24 24"
						width="24"
						height="24"
						stroke="currentColor"
						strokeWidth="2"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						className={isOpen ? "hidden" : "flex"}
					>
						<line x1="3" y1="12" x2="21" y2="12"></line>
						<line x1="3" y1="6" x2="21" y2="6"></line>
						<line x1="3" y1="18" x2="21" y2="18"></line>
					</svg>
					<svg
						viewBox="0 0 24 24"
						width="24"
						height="24"
						stroke="currentColor"
						strokeWidth="2"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						className={isOpen ? "flex fill-primary" : "hidden"}
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

		</div>
	);
};

export default Navbar;
