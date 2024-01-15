import React, { useContext, useEffect, useRef, useState } from "react";
import karontdo from "../assets/42.png";
import { useNavigate } from "react-router-dom";
import Popup from "./popups/popup";
import PopupSignUp from "./popups/PopupSignUp";
import PopupSignIn from "./popups/PopupSignIn";

interface buttonVariables {
	name: String;
	url: String;
}

const MainButton: React.FC<buttonVariables> = (props) => {
	const [isPopupVisible, setPopupVisibil] = useState(false);
	const [isPopupSignUpVisible, setPopupSignUpVisible] = useState(false);
	const [isPopupSignInVisible, setPopupSignInVisible] = useState(false);
	const [loginuser, setloginuser] = useState("");
	const naviagte = useNavigate();

	const handleButtonClick = () => {
		if (props.name === "signin") {
			setPopupVisibil(true);
			naviagte("/");
		}
		if (props.name !== "signin") {
			naviagte("/game");
			setPopupVisibil(false);
		}
	};
	// props

	return (
		<>
			<button
				className={`bg-buttonColor text-textColor w-full py-2 px-8
			rounded-full shadow-buttonShadow border-solid border-textColor border-2
			`}
				onClick={handleButtonClick}
			>
				<a>{props.name}</a>
			</button>
			{isPopupVisible && (
				<Popup
					onClose={() => setPopupVisibil(false)}
					setPopupSignUpVisible={setPopupSignUpVisible}
					setPopupSignInVisible={setPopupSignInVisible}
					setloginuser={setloginuser}
				/>
			)}
			{isPopupSignUpVisible && <PopupSignUp setPopupSignUpVisible={setPopupSignUpVisible} />}
			{isPopupSignInVisible && <PopupSignIn setPopupSignInVisible={setPopupSignInVisible} user={loginuser} />}
		</>
	);
};

export default MainButton;
