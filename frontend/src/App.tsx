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

import { BrowserRouter, Route, RouterProvider, Routes, useNavigate } from "react-router-dom";
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
import IUser from "./types/User";
import { GameContext, IGameContext } from "./components/Context/GameContext";
import GameUI from "./components/game";

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
							.post("http://sucktit.hopto.org:3001/auth/refresh", {}, { withCredentials: true })
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
	const [status, setstatus] = useState<Map<string, string>>(new Map())

	const [gameContext, setGameContext] = useState<IGameContext | null>(null)
	const navigate = useNavigate()

	useEffect(() => {
		socket.on('start_game', (data: any) => {
			setGameContext({game_id: data.game_id, issuer_id: data.user1_id, receiver_id: data.user2_id, difficulty: data.difficulty, opp: data.opp, is_host: data.is_host})
			navigate(`/game/${data.game_id}`)
		})
	
		socket.on('FEEDBACK_ERROR', (data) => {
			toast.error(data)
		})

		return () => {
			socket.off('start_game')
			socket.off('FEEDBACK_ERROR')
		}
	}, [])
	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 2500);
	});
	// this section to be moved out of this component
	useEffect(()=> {socket.emit("ONNSTATUS", {"room": -1})},
	[user])
	socket.off("ON_STATUS").on("ON_STATUS", (usersstatus: IUser[]) => 
	{
		
		usersstatus.map((user:IUser)=> 
		{
			if (user.connection_state === "DEL")
				status.delete(user.user42)
			else
			status.set(user.user42, user.connection_state)
		}
		)
		setstatus(new Map(status));
		console.log("updateted status", status)
	})
// this section to be moved out of this component

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

	console.log("status", status);
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
							{window.location.pathname !== "/loading" && (
								<>
									<Navbar />
									{(togglebar === 0 || togglebar === 1) && userin.current ? (
										<SideBar activity={status} toogle={togglebar} settogle={settoglebar} />
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
							<GameContext.Provider value={[gameContext, setGameContext]}>

							<Routes>
								<Route path="/search" element={<SearchWindow />} />
								{userin.current ? (
									<Route path="/" element={<Dashboard  status={status}/>}>
										<Route path="/profile" element={<Dashboard status={status}/>} />
										<Route path="/profile/:nickname" element={<Dashboard status={status}/>} />
									</Route>
								) : (
									<Route path="/" element={<HomePage />} />
								)}
								<Route path="/homepage" element={<HomePage />} />
								<Route path="/loading" element={<Loading />} />
								<Route path="/*" element={<HomePage />} />
								<Route path="/game" element={islogin ? <GameUI/> : <HomePage />} >
									<Route path=':gameID' element={<GameUI/>} />
							</Route>
							</Routes>
							</GameContext.Provider>

					</div>
				</currentUser.Provider>
			}
		</div>
	);
};

export default App;
