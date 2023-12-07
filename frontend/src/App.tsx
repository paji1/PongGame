import { ToastContainer, toast } from "react-toastify";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import NotificationBar from "./components/notifbar/NotificationBar";
import { SocketContext } from "./components/Context/SocketContext";
import { useContext } from "react";

const App = () => {
	const socket = useContext(SocketContext)
	socket.connect();
	return (
		<div>
			<ToastContainer />
			<Navbar />
			<SideBar />
			<NotificationBar />
		</div>
	);
};

export default App;
