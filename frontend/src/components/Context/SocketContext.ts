import { createContext } from "react";
import { Socket, io } from "socket.io-client";

const socket: Socket = io("ws://taha.redirectme.net:3001", { autoConnect: false, transports: ["websocket"] });
export const SocketContext = createContext<Socket>(socket);
