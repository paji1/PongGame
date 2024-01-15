import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PopupForm from "./popupuform";
import PopupForm2fa from "./popupuform2fa";

interface SignInPopupProps {
	setPopupSignInVisible: React.Dispatch<React.SetStateAction<boolean>>;
	user: string;
}

export interface FormDataSignIn {
	password: string;
}


const PopupSignIn: React.FC<SignInPopupProps> = (props) => {
	
	const [popup , setpopup] = useState(1);
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);
	return (
		<div className="fixed z-10  inset-0  flex items-center justify-center bg-black bg-opacity-50">
			<div className=" bg-white gap-[20%] p-6 rounded-lg shadow-xl flex  flex-row items-center justify-center w-[80%] h-[80%] border-solid border-2 border-black-700 ">
				<p className="font-bold  text-3xl basis-1/4">{(popup === 1) ? (<span>Sign In! </span>) : (<span>Two Factor Auth</span>)}</p>
				{(popup === 1) ? (<PopupForm {...{...props, setpopup}} />) :  <PopupForm2fa {...{...props, setpopup}} />}
			</div>
		</div>
		// </div>
	);
};
export default PopupSignIn;
