import { useEffect, useState } from "react";

const TwoFaBar = ({ toogle, setToggle }: { toogle: any; setToggle: any }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [currentTwoFa, setCurrentTwoFa] = useState("");
	const [TwoFa, setTwoFa] = useState(false);
	const [confirmTwoFa, setConfirmTwoFa] = useState("");

	useEffect(() => {}, []);
	const handleDropdownToggle = () => {
		if (toogle !== 3) {
			setIsDropdownOpen(true);
			setToggle(3);
		} else {
			setIsDropdownOpen(false);
			setToggle(-1);
		}
	};
	console.log("isDropdownOpen", isDropdownOpen);
	return (
		<div
			className="relative transition-all duration-200 ease-in-out "
			style={{
				transform:
					toogle === 1 || toogle === 2
						? toogle === 2
							? "translateY(7rem)"
							: "translateY(15rem)"
						: "translateY(0)",
			}}
		>
			<div
				className="relative transition-all duration-200 ease-in-out    bg-transparent text-textColor w-full py-2 px-8
			rounded-full shadow-buttonShadow border-solid border-textColor border-2
			 w-[100%]  "
			>
				<h1 className="flex justify-center">Two factor authtontication</h1>
				<hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-2 dark:bg-black" />
				<div className="flex">
					<div className="w-1/3 flex justify-end ">disable</div>
					<div className="w-1/3 flex justify-center">
						<label className="relative inline-flex items-center cursor-pointer">
							<input type="checkbox" value="" className="sr-only peer" onClick={handleDropdownToggle} />
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:bg-buttonColor rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-buttonColor"></div>
						</label>
					</div>
					<div className="w-1/3 flex justify-star ">Enable</div>
				</div>
			</div>
			{TwoFa ? (
				<img
					className="m-3"
					src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Qr_code_SelfieDuMacaque.png"
					alt=""
				/>
			) : (
				<></>
			)}
		</div>
	);
};

export default TwoFaBar;
