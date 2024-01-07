import React, { useContext, useEffect, useRef, useState } from "react";
import karontdo from "../assets/42.png";
import { useNavigate } from "react-router-dom";



interface buttonVariables {
	name: String;
	url: String;
}

interface PopupProps {
	onClose: () => void;
}
const Popup: React.FC<PopupProps> = ({ onClose }) => {
	const popupWindowRef = useRef<any>(null);
	useEffect(() => {
		const handleMessage = (event: any) => {
			console.log(event.origin);
			if (event.origin === "http://localhost:3000") {
				console.log("hello1");
				if (event.data.success) {
					onClose();
					window.location.reload();
					popupWindowRef.current.close();
				} else {
					console.error("Response  failed:", event.data.error);
				}
			}
		};

		window.addEventListener("message", handleMessage);

		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, [popupWindowRef]);

	const KarontdoIntra = () => {
		const oauthUrl = "http://localhost:3001/auth/intra/login";
		var title = "OAuth Pop-up";
		var w = 600;
		var h = 400;
		const left = window.innerWidth / 2 - w / 2;
		const top = window.innerHeight / 2 - h / 2;
		popupWindowRef.current = window.open(oauthUrl, title, `width=${w},height=${h},left=${left},top=${top}`);
		console.log("her");
	};

	return (
		<div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-6 rounded-lg shadow-xl">
				<div className="b-50 m-32 mx-auto max-w-[1199px] flex">
					<div className="w-[45%]">
						<img src={karontdo} className="w-[345px]"></img>
					</div>

					<div className="border-solid flex flex-col justify-center text-center gap-y-10">
						<p className="font-bold text-3xl">Sign in, and let the games begin!</p>
						<p className="font-bold text-1xl ">
							Ping-pong pal! It's been a minute, huh Recall the pixel paddle days? Get ready for a
							nostalgia wave your fave ping-pong platform beckons!
						</p>
						<div className=" mt-32 flex justify-center align-center">
							<button
								onClick={KarontdoIntra}
								className="flex gap-x-5 bg-yellow-500 text-black py-2 px-40 rounded-full shadow-2xl"
							>
								<img src={karontdo} className="w-[30px]"></img>
								NETWORK
							</button>
						</div>
					</div>
				</div>

				<button onClick={onClose} className="bg-yellow-500 text-black py-2 px-5 rounded-full shadow-2xl">
					{" "}
					Close{" "}
				</button>
			</div>
		</div>
	);
};

const MainButton: React.FC<buttonVariables> = (props) => {
	const [isPopupVisible, setPopupVisibil] = useState(false);
	const naviagte = useNavigate()

	const handleButtonClick = () => {
		if (props.name === "signin") { 
			setPopupVisibil(true);  
			naviagte('/')
		}
		if (props.name !== "signin")
		{
			naviagte('/game')
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
				<a>
				{props.name}
				</a>
			</button>
			{isPopupVisible && <Popup onClose={() => setPopupVisibil(false)} />}
		</>
	);
};

export default MainButton;
