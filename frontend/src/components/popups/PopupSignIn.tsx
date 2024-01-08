import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignInPopupProps {
	setPopupSignInVisible: React.Dispatch<React.SetStateAction<boolean>>;
	user: string;
}

interface FormDataSignIn {
	password: string;
}

const PopupSignIn: React.FC<SignInPopupProps> = ({ setPopupSignInVisible, user }) => {
	const [formData, setFormData] = useState<FormDataSignIn>({
		password: "",
	});
	const [matchpassword, setmatchpassword] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		console.log("submitting ", JSON.stringify({ user42: user, password: formData.password }));
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:3001/auth/local/signin", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user42: user, password: formData.password }),
			});
			console.log(response);
			if (response.ok) {
				setPopupSignInVisible(false);
				navigate("/game");
				const reload: any = window.location;
				reload.reload();
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
				<p className="font-bold  text-3xl basis-1/4">Sign In!</p>
				<form className="w-full max-w-lg  flex-auto " onSubmit={handleSubmit}>
					<div className="flex md:items-center mb-6">
						<div className="md:w-1/3">
							<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
								login intra
							</label>
						</div>
						<div className="md:w-2/3">
							<input
								className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
								id="inline-full-name"
								type="username"
								name="user42"
								onChange={handleChange}
								value={user}
								disabled
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

					<div className="md:flex md:items-center">
						<div className="md:w-1/3"></div>
						<div className="md:w-2/3">
							<div className="  flex justify-center align-center">
								<button
									className={`bg-buttonColor text-textColor w-full py-2 px-8
									rounded-full shadow-buttonShadow border-solid border-textColor border-2
									`}
								>
									Sign In
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
export default PopupSignIn;
