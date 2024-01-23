import React, { useEffect, useRef, useState } from "react";
import karontdo from "../../assets/42.png";

interface PopupProps {
	onClose: () => void;
	setPopupSignUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setPopupSignInVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setloginuser: React.Dispatch<React.SetStateAction<string>>;
}

const Popup: React.FC<PopupProps> = ({ onClose, setPopupSignUpVisible, setPopupSignInVisible, setloginuser }) => {
	const popupWindowRef = useRef<any>(null);
	const [hasHandledMessage, setHasHandledMessage] = useState(false);
	useEffect(() => {
		const handleMessage = (event: any) => {
			if (event.origin === "http://taha.redirectme.net:3000") {
				if (event.data.success) {
					onClose();
					const payload = JSON.parse(event.data.payload);
					if (payload && payload.userData && payload.userData.signUpstate === true) {
						setloginuser(payload.userData.user);
						setPopupSignInVisible(true);
					} else setPopupSignUpVisible(true);
					popupWindowRef.current.close();
				}
			}
		};

		window.addEventListener("message", handleMessage);
		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	const KarontdoIntra = () => {
		const oauthUrl = "http://taha.redirectme.net:3001/auth/intra/login";
		var title = "OAuth Pop-up";
		var w = 600;
		var h = 300;
		const left = window.innerWidth / 2 - w / 2;
		const top = window.innerHeight / 2 - h / 2;
		popupWindowRef.current = window.open(oauthUrl, title, `width=${w},height=${h},left=${left},top=${top}`);
	};

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);
	return (
		<div className="fixed z-10 inset-0  flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-DefaultColor p-6 rounded-lg shadow-xl m-[12%] max-sm:max-w-[90%]">
				<div className="b-50 m-[11%] mx-auto  max-sm:max-w-[90%] flex">
					<div className="w-[45%]">
						<img src={karontdo} className="w-[345px]"></img>
					</div>

					<div className="border-solid flex flex-col justify-center text-center gap-y-10">
						<p className="font-bold text-3xl">Sign in, and let the games begin!</p>
						<p className="font-bold text-1xl ">
							Ping-pong pal! It's been a minute, huh Recall the pixel paddle days? Get ready for a
							nostalgia wave your fave ping-pong platform beckons!
						</p>
						<div className=" md:mt-32 flex justify-center align-center">
							<button
								onClick={KarontdoIntra}
								className="flex gap-x-5 bg-yellow-500 text-black py-2 md:px-40 max-sm:px-20 rounded-full shadow-2xl"
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

export default Popup;
