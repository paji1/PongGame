import { EDifficulty } from "../components/Context/QueueingContext"
import IUser from "./User"
import { room } from "./room"

export interface INotificaion {
	id : number
	type: InviteType,
	issuer_id: IUser,
	reciever_id:IUser,
	created_at: Date,
	status: NotificationStatus,
	room_id: room,
	game_id: string
	game_mode: EDifficulty
}

export enum InviteType {
	Friend = 'Friend',
	Game = 'Game',
	Room = 'Room'
}

export enum NotificationStatus {
    pending = "pending",
    accepted = "accepted",
    refused = "refused"
}