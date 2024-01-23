import React, { useState } from "react";
import { FormDataSignIn } from "./PopupSignIn";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PopupForm2faProps {
	setPopupSignInVisible: React.Dispatch<React.SetStateAction<boolean>>;
	user: string;
	setpopup: React.Dispatch<React.SetStateAction<number>>;
}

export interface FormDataSignIn2fa {
	code: string;
}

const PopupForm2fa: React.FC<PopupForm2faProps> = ({ user, setPopupSignInVisible, setpopup }) => {
	const [formData, setFormData] = useState<FormDataSignIn2fa>({
		code: "",
	});
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await fetch("http://taha.redirectme.net:3001/auth/local/signinTwofa", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code: formData.code }),
			});
			if (response.ok) {
				setPopupSignInVisible(false);
				navigate("/");
				navigate(0);
			}
		} catch (error) {
			toast.error("retry other code");
		}
	};
	return (
		<form className="w-full max-w-lg  flex-auto " onSubmit={handleSubmit}>
			<div className="md:flex md:items-center mb-6">
				<div className="md:w-1/3">
					<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">code</label>
				</div>
				<div className="md:w-2/3">
					<input
						className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
						id="inline-code"
						type="number"
						name="code"
						onChange={handleChange}
						value={formData.code}
						placeholder="enter code number"
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
							click here
						</button>
					</div>
				</div>
			</div>
		</form>
	);
};

export default PopupForm2fa;
