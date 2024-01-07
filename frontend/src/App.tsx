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

import {
	BrowserRouter,
	Link,
	Navigate,
	Route,
	RouterProvider,
	Routes,
	createBrowserRouter,
	useNavigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import { SearchWindow } from "./Search/Search";
import { use } from "matter-js";
import axios, { Axios } from "axios";
import Loading from "./components/loading/loading";

// TODO: this is a temporary trqi3a

const router = createBrowserRouter([
	{
		path: "/",
		element: <Dashboard />,
	},
	{
		path: "/game",
		element: <GameMain />,
	},
]);

const Refreshinterval = () => {
	const [error, setError] = useState<string | null>(null);
	const intervalRef = useRef<NodeJS.Timer | undefined>();

	const getToken = useCallback(() => {
		axios
			.post("http://localhost:3001/auth/refresh", {}, { withCredentials: true })
			.then((res) => {
				console.log(res);
				console.log(res.data);
			})
			.catch((err): any => {
				console.error("axios get refresh error:", err);
				setError("error : refresh token not found");
			});
	}, []);

	useEffect(() => {
		getToken();
		const interval = setInterval(() => getToken(), 14 * 60 * 1000);
		intervalRef.current = interval;

		return () => clearInterval(interval);
	}, [getToken]);

	useEffect(() => {
		if (error) {
			toast.error(error);
			setError(null);
		}
	}, [error]);

	return <></>;
};

const App = () => {
	const [user, setuser] = useState<CurrentUser | null>(null);
	const [islogin, setIsLogin] = useState<boolean>(false);
	const socket = useContext(SocketContext);
	const [togglebar, settoglebar] = useState(0);
	useEffect(() => {
		console.log("start");
		const isLoggedIn = async () => {
			const res = await fetch(`http://${ip}3001/users/isLogin`, { credentials: "include", method: "GET" })
				.then((res) => {
					if (!res.ok) {
						setIsLogin(false);
						throw new Error(`Error! status ${res.status}`);
					}
					setIsLogin(true);
				})
				.catch((e) => console.log("hiiiii"));

			console.log("finish");
		};

		isLoggedIn();
		const items = Cookies.get("userData");
		if (items && islogin) {
			setuser(JSON.parse(items));
		}
	}, [islogin]);

	if (user) {
		socket.connect();
	}

	socket.off("HANDSHAKE").on("HANDSHAKE", () => socket.emit("HANDSHAKE", "hhhhhhhhhhhhhhhhh li ..."));
	return (
		<div>
			<Refreshinterval />
			<ToastContainer />
			{
				<currentUser.Provider value={user}>
					<div>
						<BrowserRouter>
							{window.location.pathname !== "/loading" && (
								<>
									<Navbar />
									{(togglebar === 0 || togglebar === 1) && user ? (
										<SideBar toogle={togglebar} settogle={settoglebar} />
									) : (
										<></>
									)}
									{(togglebar === 0 || togglebar === 2) && user ? (
										<NotificationBar toogle={togglebar} settogle={settoglebar} />
									) : (
										<></>
									)}
								</>
							)}
							<Routes>
								<Route path="/search" element={<SearchWindow />} />
								<Route path="/" element={<Dashboard />} />
								<Route path="/game" element={islogin ? <GameMain /> : <Dashboard />} />
								<Route path="/loading" element={<Loading />} />
								<Route path="/*" element={<Dashboard />} />
							</Routes>
						</BrowserRouter>
					</div>
				</currentUser.Provider>
			}
		</div>
	);
};

export default App;
