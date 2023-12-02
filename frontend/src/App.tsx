import { ToastContainer, toast } from "react-toastify";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import NotificationBar from "./components/notifbar/NotificationBar";

const App = () => {
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
