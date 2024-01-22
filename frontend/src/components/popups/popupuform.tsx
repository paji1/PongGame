import React, { useState } from "react";
import { FormDataSignIn } from "./PopupSignIn";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PopupFormProps {
	setPopupSignInVisible: React.Dispatch<React.SetStateAction<boolean>>;
	user: string;
	setpopup: React.Dispatch<React.SetStateAction<number>>;
}

const PopupForm: React.FC<PopupFormProps> = ({ user, setPopupSignInVisible,setpopup  }) => {
	const [set2fa, setmatchpassword] = useState<boolean>(false);
	const [formData, setFormData] = useState<FormDataSignIn>({
		password: "",
	});
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await fetch("http://sucktit.hopto.org:3001/auth/local/signin", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user42: user, password: formData.password }),
			});
			
			if (response.ok) {
				try {
					const { is2fa } = await response.json();
					setpopup(2);
					
				} catch (error) {
					
					navigate("/");
					navigate(0);
					setPopupSignInVisible(false);
				}

			}
			toast.error("try with correct password");
		} catch (error) {
			toast.error("no no");
		}
	};
	return (
		
		<form className="w-full max-w-lg  flex-auto " onSubmit={handleSubmit}>
			<div className="flex md:items-center mb-6">
				<div className="md:w-1/3">
					<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">login intra</label>
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
					<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">Password</label>
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
	);
};

export default PopupForm;
