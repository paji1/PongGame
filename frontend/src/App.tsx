import { ToastContainer, toast } from "react-toastify";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import NotificationBar from "./components/notifbar/NotificationBar";
import { ErrorInfo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { currentUser, CurrentUser } from "./components/Context/AuthContext";
import { log } from "console";
import { ip } from "./network/ipaddr";
import { SocketContext } from "./components/Context/SocketContext";
import GameMain from "./components/game";
import Cookies from "js-cookie";

import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import { SearchWindow } from "./Search/Search";
import { use } from "matter-js";
import axios, { Axios } from "axios";
import Loading from "./components/loading/loading";
import Refreshinterval from "./components/refreshInterval/refreshInterval";
import HomePage from "./components/HomePage/HomePage";
import SettingBar from "./components/settingBar/settingBar";
import QueueLoader from "./components/game/QueueLoader";
import useRefreshinterval from "./components/refreshInterval/refreshInterval";

// TODO: this is a temporary trqi3a


interface AsyncRefreshtoken  {
	setitems: React.Dispatch<any>;
	item: any;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
	userin : React.MutableRefObject<CurrentUser | null>;
	islogin: boolean;

}
const asyncRefreshtoken = async ( prop : AsyncRefreshtoken)  => {

	await axios
							.post("http://localhost:3001/auth/refresh", {}, { withCredentials: true })
							.then((res) => {
								prop.setitems(Cookies.get("userData"));
								if (prop.item && prop.islogin) {
									prop.userin.current = JSON.parse(prop.item).user;
									// setuser(userin.current);
								}
								prop.setIsLogin(true);
							})
							.catch((err): any => {
								// console.error("axios get refresh error:", err);
								// toast.error("error : refresh token not found");
							});
} 
const App = () => {
	const userin = useRef<CurrentUser | null>(null);
	const [user, setuser] = useState<CurrentUser | null>(null);
	const [item, setitems] = useState<any>(null);
	const [islogin, setIsLogin] = useState<boolean>(false);
	const socket = useContext(SocketContext);
	const [togglebar, settoglebar] = useState(0);
	const [isLoading, setLoading] = useState(true);
	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 2500);
	});

	useEffect(() => {
		console.log("start");
		const isLoggedIn = async () => {
			const res = await fetch(`http://${ip}3001/users/isLogin`, { credentials: "include", method: "GET" })
			.then(async (res) => {
				if (!res.ok) {
					
						asyncRefreshtoken({setitems,item, setIsLogin,userin ,islogin})
						throw new Error(`Error! status ${res.status}`);
					}

					setitems(Cookies.get("userData"));
					if (item && islogin) {
						userin.current = JSON.parse(item).user;
						setuser(userin.current);
					}
					setIsLogin(true);
				})
				.catch((e) => console.log("hiiiii"));

			console.log("finish");
		};

		isLoggedIn();
	}, [islogin, item]);

	useRefreshinterval();
	if (userin.current && !user) {
		setuser(userin.current);
	}
	if (userin.current) {
		socket.connect();
		socket.off("HANDSHAKE").on("HANDSHAKE", () => socket.emit("HANDSHAKE", "hhhhhhhhhhhhhhhhh li ..."));
	}

	if (isLoading && window.location.pathname !== "/loading")
		return (
			<div className="flex justify-center items-center max-w-[1536px] h-[50rem] m-auto">
				<QueueLoader />
			</div>
		);
	return (
		<div>
			<ToastContainer />
			{
				<currentUser.Provider value={userin.current}>
					<div>
						<BrowserRouter>
							{window.location.pathname !== "/loading" && (
								<>
									<Navbar />
									{(togglebar === 0 || togglebar === 1) && userin.current ? (
										<SideBar toogle={togglebar} settogle={settoglebar} />
									) : (
										<></>
									)}
									{(togglebar === 0 || togglebar === 2) && userin.current ? (
										<NotificationBar toogle={togglebar} settogle={settoglebar} />
									) : (
										<></>
									)}
									{(togglebar === 0 || togglebar === 3) && userin.current ? (
										<SettingBar toogle={togglebar} settogle={settoglebar} />
									) : (
										<></>
									)}
								</>
							)}
							<Routes>
								<Route path="/search" element={<SearchWindow />} />
								{userin.current ? (
									<Route path="/" element={<Dashboard />}>
										<Route path="/profile" element={<Dashboard />} />
										<Route path="/profile/:nickname" element={<Dashboard />} />
									</Route>
								) : (
									<Route path="/" element={<HomePage />} />
								)}
								<Route path="/game" element={islogin ? <GameMain /> : <HomePage />} />
								<Route path="/homepage" element={<HomePage />} />
								<Route path="/loading" element={<Loading />} />
								<Route path="/*" element={<HomePage />} />
							</Routes>
						</BrowserRouter>
					</div>
				</currentUser.Provider>
			}
		</div>
	);
};

export default App;
