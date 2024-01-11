import { useState } from "react";

const ChangePassword = ({toogle,  setToggle} : {toogle : any,  setToggle: any} ) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleDropdownToggle = () => {
		
		if (toogle !== 1 ) 
		{
			setIsDropdownOpen(true);
			setToggle(1) 
		}
		else
		{
			setIsDropdownOpen(false);

			setToggle(-1) ;
		}
	};
	return (
		<div className="relative">
			<button
				className="bg-transparent text-textColor w-full py-2 px-8
				rounded-full shadow-buttonShadow border-solid border-textColor border-2
				 w-[100%] duration-1000 delay-1000 "
				onClick={handleDropdownToggle}
			>
				Change Password
			</button>
			{isDropdownOpen && toogle  === 1 &&  (
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
							onChange={(e) => setConfirmPassword(e.target.value)}
							className=" appearance-none bg-white text-textColor w-full py-2 px-8
							rounded-full shadow-buttonShadow border-solid border-textColor border-2
							 w-[100%]   leading-tight focus:outline-none focus:shadow-outline"
							 placeholder="Confirm Password"
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
			)}
		</div>
	);
};



export default ChangePassword;