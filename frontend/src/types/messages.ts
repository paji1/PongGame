import { permission } from "./room";

type room = {
	id: number;
	name: string;
	roomtypeof: permission;
};
type sender = {
	id: number;
	avatar: string;
	nickname: string;
};

export type message = {
	sender_id: number;
	created_at: Date;
	messages: string;
	roomid: room;
	senderid: sender;
};
