import React, { FC, useContext, useState } from "react";
import { ToggleButtonSetting } from "./ToggleButtonSetting";
import { HoverDiv } from "../Common";
import { CurrentUser, currentUser } from "../Context/AuthContext";
import profileplaceholder from "../../assets/profileplaceholder.png";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./passwordBar";
import ChangeNickname from "./nicknameBar";
import TwoFaBar from "./twoFaBar";
import { toast } from "react-toastify";

const logout = async (navigate: any) => {
	const res = await fetch("http://wladnas.ddns.net:3001/auth/logout", {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	}).then(async (res) => {
		if (!res.ok) {
			toast.error("error to logout nickname");
			return;
		}
		navigate("/");
		navigate(0);
	});
};
interface SettingBarProps {
	toogle: number;
	settogle: any;
}

const SettingBar: FC<SettingBarProps> = ({ toogle, settogle }) => {
	const [isOpen, seIsOpen] = useState(false);
	const [state, setState] = useState(1);
	const [newAlert, setNewAlert] = useState(false);
	const [toggle, setToggle] = useState(-1);
	const navigate = useNavigate();

	const logouthandler = (e: any) => {
		e.preventDefault();
		logout(navigate);
	};
	const toggleChatBar = () => {
		seIsOpen(!isOpen);
		if (!isOpen) settogle(3);
		else settogle(0);
		newAlert ? setNewAlert(!newAlert) : setNewAlert(newAlert);
	};
	const user: CurrentUser | null = useContext(currentUser);

	let nickname: string;
	if (user?.nickname) nickname = user?.nickname;

	return (
		<div>
			{isOpen && <HoverDiv toggleChatBar={toggleChatBar} />}
			<ToggleButtonSetting isOpen={isOpen} isNewAlert={newAlert} setIsOpen={toggleChatBar} />
			<section
				className={`fixed inset-y-0 right-0 bg-background border-l-2 border-solid 
			sm:w-[85%] md:w-1/2 lg:w-1/2 xl:w-[35%] 2xl:w-[30%] w-[90%] transition-all duration-300
			font-pixelify z-50
			${isOpen ? "transform translate-x-0" : "transform translate-x-full"}`}
			>
				<div className={`flex flex-col gap-2 h-full max-h-full min-h-full p-1 divide-x`}>
					<div
						className={`grid grid-cols-10 gap-1 p-1 h-[92px] min-h-[92px] content-evenly
					cursor-pointer`}
					>
						<div className={`col-span-2`}>
							<img
								className={`border-2 border-solid border-textColor w-[72px] min-w-[72px] min-h-[72px] h-[72px]`}
								src={`${!user ? profileplaceholder : user.avatar}`}
								alt=""
							/>
						</div>
						<div className={`col-span-4 gap-2 p-2`}>
							<h2 className={`text-primary font-pixelify font-bold text-lg`}>
								{user ? user.nickname : "Loading..."}
							</h2>
							<p
								className={`${
									state === 1 ? "text-sucessColor" : state === 2 ? "text-errorColor" : "text-primary"
								}
							text-xs
						`}
							>
								<span>•</span>
								{state === 1 ? " Online" : state === 2 ? "Offline" : "In-game"}
							</p>
						</div>

						<div className="  col-span-2  justify-center  bg-red-800 text-slate-50 shadow-lg rounded-sm h-11 my-auto flex    ">
							<button onClick={logouthandler}>log out</button>
						</div>
					</div>
					<hr className="my-1 h-0.5 border-t-0 bg-textColor opacity-100" />

					<div className={`flex flex-col flex-1 py-3 min-h-[100px] gap-2 px-2 sm:px-3 overflow-y-scroll`}>
						<ChangePassword toogle={toggle} setToggle={setToggle} />
						<ChangeNickname toogle={toggle} setToggle={setToggle} />
						<TwoFaBar toogle={toggle} setToggle={setToggle} />
					</div>
				</div>
			</section>
		</div>
	);
};

export default SettingBar;
