import React from "react";
import "./index.css";
import App from "./App";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import profileplaceholder from "./assets/profileplaceholder.png";
import "react-toastify/dist/ReactToastify.css";
import { SocketContext } from "./components/Context/SocketContext";
import { Socket, io } from "socket.io-client";
import { ip } from "./network/ipaddr";

const socket: Socket = io(`ws://${ip}3001`, { autoConnect: false, transports: ["websocket"] });


const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<SocketContext.Provider value={socket}>
			<RouterProvider router={router} />
	</SocketContext.Provider>
);
