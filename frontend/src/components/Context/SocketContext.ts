import { createContext } from 'react';
import {  Socket, io} from 'socket.io-client';

const socket:Socket  = io("ws://sucktit.hopto.org:3001", {autoConnect: false , transports: ['websocket']})
export const SocketContext = createContext<Socket>(socket)

