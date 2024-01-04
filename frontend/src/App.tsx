import { ToastContainer, toast } from "react-toastify";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import NotificationBar from "./components/notifbar/NotificationBar";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { currentUser, CurrentUser } from "./components/Context/AuthContext";
import { log } from "console";
import { ip } from "./network/ipaddr";
import { SocketContext } from "./components/Context/SocketContext";
import GameMain from "./components/game";

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

const getuser = (setuser: any) => {
	fetch("http://" + ip + "3001/users", { credentials: "include" })
		.then((data) => data.json())
		.then((data) => {
			let res = data.statusCode;
			if (res === undefined) {
				setuser(data);
			} else toast.error(data.message);
		})
		.catch((e) => toast.error("user network error"));
};

const Signup = () => {
	const [username, setuser] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const setusername = (e: any) => setuser(e.target.value);
	const setpass = (e: any) => setPassword(e.target.value);

	const signup = async () => {
		const res = await fetch("http://" + ip + "3001/auth/local/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				user42: username,
				password: password,
			}),
		}).catch((e) => toast.error(e.message));
	};

	const submitQuery = async (e: any) => {
		e.preventDefault();
		await signup();
	};
	return (
		<form>
			sign up
			<div className={`flex items-start h-fill`}>
				<input
					type="search"
					id="search-dropdown"
					onChange={setusername}
					value={username}
					placeholder="enter username."
					required
				></input>
				<input
					type="search"
					id="search-dropdown"
					onChange={setpass}
					value={password}
					placeholder="enter password"
					required
				></input>
				<button onClick={submitQuery}>signin</button>
			</div>
		</form>
	);
};

const Signin = ({ setUser }: { setUser: any }) => {
	const [username, setuser] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const setusername = (e: any) => setuser(e.target.value);
	const setpass = (e: any) => setPassword(e.target.value);

	const login = async () => {
		const res = fetch("http://" + ip + "3001/auth/local/signin", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				user42: username,
				password: password,
			}),
		})
			.then(() => {})
			.catch((e) => toast.error(e.message));
	};

	const submitQuery = async (e: any) => {
		e.preventDefault();
		login();
		getuser(setuser);
	};
	return (
		<>
			<button
				onClick={() => window.location.replace(`http://${ip}3001/auth/intra/login`)}
				className="btn btn-primary"
			>
				intra
			</button>
			<form>
				signin
				<div className={`flex items-start h-fill`}>
					<input
						type="search"
						id="search-dropdown"
						onChange={setusername}
						value={username}
						placeholder="enter username."
						required
					></input>
					<input
						type="search"
						id="search-dropdown"
						onChange={setpass}
						value={password}
						placeholder="enter password"
						required
					></input>
					<button onClick={submitQuery}>login</button>
				</div>
			</form>
		</>
	);
};

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
	const socket = useContext(SocketContext);
	const [togglebar, settoglebar] = useState(0);
	if (!user) getuser(setuser);
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
								<Route path="/game" element={<GameMain />} />
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
