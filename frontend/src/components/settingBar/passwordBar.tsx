import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const submitepame = async (currentPassword: string, newPassword: string, confirmPassword: string, navigate: any) => {
	const res = await fetch("http://wladnas.ddns.net:3001/auth/local/apdate/password", {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword }),
	}).then(async (res) => {
		if (!res.ok) {
			toast.error("error to update nickname")
			return ;
		};
		toast.success(`password changed`);
	});
};

const ChangePassword = ({ toogle, setToggle }: { toogle: any; setToggle: any }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmPasswordError, setConfirmPasswordErro] = useState(false);

	const navigate = useNavigate();

	const handleDropdownToggle = () => {
		if (toogle !== 1) {
			setIsDropdownOpen(true);
			setToggle(1);
		} else {
			setIsDropdownOpen(false);

			setToggle(-1);
		}
	};
	const handleSubmit = (e: any) => {
		console.log("newnickname");
		e.preventDefault();
		submitepame(currentPassword, newPassword, confirmPassword, navigate);
	};
	return (
		<div className="relative">
			<button
				className="bg-transparent text-textColor w-full py-2 px-8
				rounded-md shadow-buttonShadow border-solid border-textColor border-2
				 w-[100%] duration-1000 delay-1000 "
				onClick={handleDropdownToggle}
			>
				Change Password
			</button>
			{isDropdownOpen && toogle === 1 && (
					<form action="POST" onSubmit={handleSubmit}>
				<div className=" duration-1000 delay-1000 absolute z-10 bg-transparent text-textColor w-full py-2 px-8 border-2 w-[100%] flex justify-center flex-col items-center text-center">
					<div className="mb-4">
						<input
							type="password"
							id="currentPassword"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							className="appearance-none bg-white text-textColor w-full py-2 px-8
							rounded-full shadow-buttonShadow border-solid border-textColor border-2
							w-[100%]   leading-tight focus:outline-none focus:shadow-outline"
							placeholder="Current Password"
							/>
					</div>
					<div className="mb-4">
						<input
							type="password"
							id="newPassword"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="appearance-none bg-white text-textColor w-full py-2 px-8
							rounded-full shadow-buttonShadow border-solid border-textColor border-2
							w-[100%]   leading-tight focus:outline-none focus:shadow-outline"
							placeholder="new Password"
							/>
					</div>
					<div>
						<input
							type="password"
							id="confirmPassword"
							value={confirmPassword}
							onChange={(e) => {
								newPassword.length <= e.target.value.length && e.target.value !== newPassword
								? setConfirmPasswordErro(true)
								: setConfirmPasswordErro(false);
								setConfirmPassword(e.target.value);
							}}
							className={`appearance-none ${
								confirmPasswordError ? "bg-red-300" : "bg-white"
							} text-textColor w-full py-2 px-8
							rounded-full shadow-buttonShadow border-solid border-textColor border-2
							 w-[100%]   leading-tight focus:outline-none focus:shadow-outline`}
							placeholder={`${confirmPasswordError ? "error" : "Confirm Password"}`}
						/>
					</div>
					<button
						className="bg-buttonColor text-textColor w-full py-2 px-8
						rounded-full shadow-buttonShadow border-solid border-textColor border-2
						w-[100%]  mt-4"
						// ... handle password change submission
					>
						Change Password
					</button>
				</div>
				</form>
			)}
		</div>
	);
};

export default ChangePassword;
