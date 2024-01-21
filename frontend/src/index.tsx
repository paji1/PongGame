import React   from "react";
import "./index.css";
import App from "./App";
import * as ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import { SocketContext } from "./components/Context/SocketContext";
import { Socket, io } from "socket.io-client";
import { ip } from "./network/ipaddr";
import { BrowserRouter } from "react-router-dom";

const socket: Socket = io(`ws://${ip}3001`, { autoConnect: false, transports: ["websocket"] });




const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<SocketContext.Provider value={socket}>
		<BrowserRouter>
			<App />
		</BrowserRouter>

	</SocketContext.Provider>
);
