import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
			if (value !== formData.password) {
				setmatchpassword(true);
			}
			if (value === formData.password) setmatchpassword(false);
		}
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (formData.password !== formData.retype_password) {
			return;
		}
		try {
			const response = await fetch("http://lghoul.ddns.net:3001/auth/local/signup", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nickname: formData.nickname, password: formData.password }),
			});
			if (response.ok) {
				setPopupSignUpVisible(false);
				navigate("/");
				navigate(0);
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
		<div className="fixed z-10  inset-0  flex items-center justify-center bg-black bg-opacity-50">
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
					{matchpassword ? (
						<div className="md:flex md:items-center mb-6">
							<div className="md:w-1/3"></div>
							<label className="md:w-2/3 block text-red-500 font-bold">
								<span className="text-sm">Paassword Not Match!</span>
							</label>
						</div>
					) : (
						<></>
					)}
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
export default PopupSignUp;
