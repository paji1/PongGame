import IUser from "./User";
import { messages } from "./messages";
export enum permission {
	chat,
	private,
	public,
	protected,
}

 export type member = {
	id: number,
	roomid:number,
	permission:string,
	isblocked:boolean,
	ismuted:boolean,
	isBanned:boolean,
	created_at:Date,
	user_id: IUser;
};

export type room = {
	messages: messages[],
	preview: string,
	id: number;
	name: string;
	roomtypeof: string;
	rooms_members: member[];
	created_at: string;
};
