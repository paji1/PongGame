import { useState } from "react";

const ChangeNickname = ({toogle,  setToggle} : {toogle : any,  setToggle: any}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [currentnickname, setCurrentnickname] = useState("");
	const [newnickname, setNewnickname] = useState("");
	const [confirmnickname, setConfirmnickname] = useState("");

	const handleDropdownToggle = () => {
		if (toogle !== 2 ) 
		{
			setIsDropdownOpen(true);
			setToggle(2) 
		}
		else
		{
			setIsDropdownOpen(false);
			setToggle(-1) ;
		}
	};
	return (
		<div className="relative transition-all duration-200 ease-in-out " 
		style={{ transform: toogle === 1  ? 'translateY(15rem)' : 'translateY(0)' }}
		>
			<button
				className="bg-transparent text-textColor w-full py-2 px-8
				rounded-full shadow-buttonShadow border-solid border-textColor border-2
				 w-[100%] duration-1000 delay-1000"
				onClick={handleDropdownToggle}
			>
				Change nickname
			</button>
			{isDropdownOpen && toogle === 2 && (
				<div
					className="absolute z-10 bg-transparent text-textColor w-full py-2 px-8
				rounded-sm shadow-buttonShadow border-spacing-1 border-textColor border-2 w-[100%] flex justify-center flex-col items-center text-center  "
				>
					<div className="mb-4">
						<label htmlFor="currentnickname" className="block  text-gray-700 font-bold mb-2">
							Current nickname
						</label>
						<input
							type="nickname"
							id="currentnickname"
							value={currentnickname}
							onChange={(e) => setCurrentnickname(e.target.value)}
							className="appearance-none bg-white text-textColor w-full py-2 px-8
							rounded-full shadow-buttonShadow border-solid border-textColor border-2
							 w-[100%]  mt-4 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<button
						className="bg-buttonColor text-textColor w-full py-2 px-8
						rounded-full shadow-buttonShadow border-solid border-textColor border-2
						 w-[100%]  mt-4"
						// ... handle nickname change submission
					>
						Change nickname
					</button>
				</div>
			)}
		</div>
	);
};

export default ChangeNickname;
