import { Id } from "react-toastify";
import { permission } from "./room";


type sender = {
	id: number;
	avatar: string;
	nickname: string;
};

export type messages = {
	room_id:	number;
	created_at: Date;
	messages: string;
	senderid: sender;
};
export type roommessages = {
	id: number
	messages: messages[];
}

export type SocketMessage = 
{
	Destination: number;
    Message: string
}

