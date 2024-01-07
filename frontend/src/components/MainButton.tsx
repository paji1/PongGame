import React, { useContext, useEffect, useRef, useState } from "react";
import karontdo from "../assets/42.png";
import { useNavigate } from "react-router-dom";

interface buttonVariables {
	name: String;
	url: String;
}

interface PopupProps {
	onClose: () => void;
	setPopupSignUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
interface SignUpPopupProps {
	setPopupSignUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
interface FormData {
	nickname: string;
	password: string;
	retype_password: string;
}

const PopupSignUp: React.FC<SignUpPopupProps> = ({ setPopupSignUpVisible }) => {
	const [formData, setFormData] = useState<FormData>({
		nickname: "",
		password: "",
		retype_password: "",
	});
	const [matchpassword, setmatchpassword] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "retype_password" && value.length >= formData.password.length) {
			if (value !== formData.password)
			{
				setmatchpassword(true)	
			}
			if (value === formData.password)
				setmatchpassword(false)
		}
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		console.log("submitting ", JSON.stringify({ nickname: formData.nickname, password: formData.password }));
		e.preventDefault();
		if (formData.password !== formData.retype_password)
		{
			return ;
		}
		try {
			const response = await fetch("http://localhost:3001/auth/local/signup", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: formData.nickname, password: formData.password }),
			});
			console.log(response);
			if (response.ok)
			{
				setPopupSignUpVisible(false);
				navigate('/game');
				window.location.reload();
				
			}
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);
	return (
		<div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-50">
			<div className=" bg-white gap-[20%] p-6 rounded-lg shadow-xl flex  flex-row items-center justify-center w-[80%] h-[80%] border-solid border-2 border-black-700 ">
				<p className="font-bold  text-3xl basis-1/4">Sign Up!</p>
				<form className="w-full max-w-lg  flex-auto " onSubmit={handleSubmit}>
					<div className="flex md:items-center mb-6">
						<div className="md:w-1/3">
							<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
								nickname
							</label>
						</div>
						<div className="md:w-2/3">
							<input
								className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
								id="inline-full-name"
								type="nickname"
								placeholder="nickname"
								name="nickname"
								onChange={handleChange}
								value={formData.nickname}
							/>
						</div>
					</div>
					<div className="md:flex md:items-center mb-6">
						<div className="md:w-1/3">
							<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
								Password
							</label>
						</div>
						<div className="md:w-2/3">
							<input
								className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
								id="inline-password"
								type="password"
								name="password"
								onChange={handleChange}
								value={formData.password}
								placeholder="******************"
							/>
						</div>
					</div>
					<div className="md:flex md:items-center mb-6">
						<div className="md:w-1/3">
							<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
								retype_Password
							</label>
						</div>
						<div className="md:w-2/3">
							<input
								className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
								id="inline-retype_password"
								type="password"
								name="retype_password"
								onChange={handleChange}
								value={formData.retype_password}
								placeholder="******************"
							/>
						</div>
					</div>
					{(matchpassword) ? <div className="md:flex md:items-center mb-6">
						<div className="md:w-1/3"></div>
						<label className="md:w-2/3 block text-red-500 font-bold">
							<span className="text-sm">Paassword Not Match!</span>
						</label>
					</div> : <></>}
					<div className="md:flex md:items-center">
						<div className="md:w-1/3"></div>
						<div className="md:w-2/3">
							<div className="  flex justify-center align-center">
								<button
									className={`bg-buttonColor text-textColor w-full py-2 px-8
									rounded-full shadow-buttonShadow border-solid border-textColor border-2
									`}
								>
									Sign Up
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
		// </div>
	);
};

const Popup: React.FC<PopupProps> = ({ onClose, setPopupSignUpVisible }) => {
	const popupWindowRef = useRef<any>(null);
	useEffect(() => {
		const handleMessage = (event: any) => {
			console.log(event.origin);
			if (event.origin === "http://localhost:3000") {
				console.log("hello1");
				if (event.data.success) {
					onClose();
					console.log(JSON.parse(event.data.payload));
					const payload = JSON.parse(event.data.payload);
					if (payload  && payload.userData && payload.userData.signUpstate === true)
						window.location.reload();
					else
						setPopupSignUpVisible(true);
					console.log(JSON.parse(event.data.payload).userData.signUpstate);
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
	const [isPopupSignUpVisible, setPopupSignUpVisible] = useState(false);
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
				<a>
				{props.name}
				</a>
			</button>
			{isPopupVisible && (
				<Popup onClose={() => setPopupVisibil(false)} setPopupSignUpVisible={setPopupSignUpVisible} />
			)}
			{isPopupSignUpVisible && <PopupSignUp setPopupSignUpVisible={setPopupSignUpVisible} />}
		</>
	);
};

export default MainButton;
