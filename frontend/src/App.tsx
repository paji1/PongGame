import { ToastContainer, toast } from "react-toastify";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import NotificationBar from "./components/notifbar/NotificationBar";
import { useContext, useState } from "react";
import { currentUser, CurrentUser } from "./components/Context/AuthContext";
import { log } from "console";
import { ip } from "./network/ipaddr";
import { SocketContext } from "./components/Context/SocketContext";
import GameMain from "./components/game";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";

const getuser = (setuser:any)=>
	{
		fetch("http://" + ip + "3001/users",{ credentials: 'include'} ).then((data) => data.json()).then((data)=>{
			let res = data.statusCode
			if (res === undefined)
			{
				setuser(data)
			}
			else
				toast.error(data.message)
		}).catch((e)=> toast.error("user network error"))
;
}

const Signup = () => 
{
	const [username, setuser] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const setusername = (e: any) => setuser(e.target.value);
	const setpass = (e: any) => setPassword(e.target.value);
	const signup = async () => {
	
		const res = await fetch("http://" + ip + "3001/auth/local/signup", {
			method: "POST"
			, headers: { "Content-Type": "application/json" }
			,  credentials: 'include'
			, body: JSON.stringify({
				user42: username,
				password: password
			})
		}
		).catch((e) => toast.error(e.message))
	}


	const submitQuery = async (e: any) => {
		e.preventDefault();
		await signup()
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
				<button
					onClick={submitQuery}
				>
					signin
				</button>
			</div>
		</form>
	);
}

const Signin = ({setUser} : {setUser: any}) => 
{
	const [username, setuser] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const setusername = (e: any) => setuser(e.target.value);
	const setpass = (e: any) => setPassword(e.target.value);

	const login = async () => {
		const res = fetch("http://" + ip + "3001/auth/local/signin", {
			method: "POST"
			, headers: { "Content-Type": "application/json" }
			,  credentials: 'include'
			, body: JSON.stringify({
				user42: username,
				password: password
			})
		}
		)
		.catch((e) => toast.error(e.message))
	}


	const submitQuery = async (e: any) => {
		e.preventDefault();
		login()
		getuser(setuser)
	};
	return (
		<>
		<button onClick={() => window.location.replace(`http://${ip}3001/auth/intra/login`)} className="btn btn-primary">intra</button>
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
				<button
					onClick={submitQuery}
					>
					login
				</button>
			</div>
		</form>
</>
	);
}

// TODO: this is a temporary trqi3a 

const router = createBrowserRouter([
	{
		path: '/',
		element: <Dashboard />
	},
	{
		path: "/game",
		element: <GameMain />
	}
])

const  KarontdoIntra = async () => {
	const res = await fetch(`http://localhost:3001/auth/intra/login`, {  mode: 'no-cors' ,method: "GET", credentials: "include",
		headers: {
		"Content-Type": "application/json"
		},}, )
	console.log(res)
  };

const App = () => {
	const [user, setuser] = useState<CurrentUser | null >(null)
	const socket = useContext(SocketContext)
	if (!user)
		getuser(setuser)
	if (user)
		{
			socket.connect()
			socket.emit("init", {})
		}
	return (
		<div>
			<ToastContainer />
			{user ?
					<currentUser.Provider value={user}>
					<Navbar />
					<SideBar />
					<NotificationBar />
					<RouterProvider router={router} />
					
				</currentUser.Provider > :
			 <>
			 	<Signup  />
			 	<Signin setUser={setuser} />
			 </> 
			}
			
		</div>
	);
};

export default App;

