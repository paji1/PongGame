import IUser from "./User";
import { room } from "./room";

export interface INotificaion {
	id: number;
	type: InviteType;
	issuer_id: IUser;
	reciever_id: IUser;
	created_at: Date;
	status: NotificationStatus;
	room_id: room;
}

export enum InviteType {
	Friend = "Friend",
	Game = "Game",
	Room = "Room",
}

export enum NotificationStatus {
	pending = "pending",
	accepted = "accepted",
	refused = "refused",
}
