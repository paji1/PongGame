import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const changeName = async (nickname: string, navigate : any) => {
	const res = await fetch("http://sucktit.hopto.org:3001/auth/local/apdate/nickname", {
		method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ newNickname : nickname }),
	}).then(async (res) => {
		if (!res.ok)
		{
			toast.error("error to update nickname")
			return ;
		}
		toast.success(`page well refrech in  in 1 secend`)
		setTimeout(() => {
			navigate(0);

		}, 3000);
	});
};

const ChangeNickname = ({ toogle, setToggle }: { toogle: any; setToggle: any }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [currentnickname, setCurrentnickname] = useState("");
	const [newnickname, setNewnickname] = useState("");
	const [confirmnickname, setConfirmnickname] = useState("");
	const navigate =  useNavigate();

	const handleDropdownToggle = () => {
		if (toogle !== 2) {
			setIsDropdownOpen(true);
			setToggle(2);
		} else {
			setIsDropdownOpen(false);
			setToggle(-1);
		}
	};

	const handleSubmit = (e : any) => {
		console.log("newnickname")
		e.preventDefault();
		changeName(newnickname, navigate);
	}
	return (
		<div
			className="relative transition-all duration-200 ease-in-out "
			style={{ transform: toogle === 1 ? "translateY(15rem)" : "translateY(0)" }}
		>
			<button
				className="bg-transparent text-textColor w-full py-2 px-8
				rounded-md shadow-buttonShadow border-solid border-textColor border-2
				 w-[100%] duration-1000 delay-1000"
				onClick={handleDropdownToggle}
			>
				Change nickname
			</button>
			{isDropdownOpen && toogle === 2 && (
				<div className=" duration-1000 delay-1000 absolute z-10 bg-transparent text-textColor w-full py-2 px-8 border-2 w-[100%] flex justify-center flex-col items-center text-center ">
					<form action="POST" onSubmit={handleSubmit}>

					<div>
						<input
							type="nickname"
							id="nickname"
							value={newnickname}
							onChange={(e) => setNewnickname(e.target.value)}
							className=" appearance-none bg-white text-textColor w-full py-2 px-8
							rounded-full shadow-buttonShadow border-solid border-textColor border-2
							 w-[100%]   leading-tight focus:outline-none focus:shadow-outline"
							placeholder="new nickname"
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
					</form>
				</div>
			)}
		</div>
	);
};

export default ChangeNickname;
