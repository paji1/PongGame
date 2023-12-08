import { messages } from "./messages";
export enum permission {
	chat,
	private,
	public,
	protected,
}
type member_filler = {
	avatar: string;
	nickname: string;
	id: number;
};
 export type member = {
	permission:string,
	isblocked:boolean,
	ismuted:boolean,
	isBanned:boolean,
	user_id: member_filler;
	created_at:Date,
};

export type room = {
	messages: string
	id: number;
	name: string;
	roomtypeof: string;
	rooms_members: member[];
	created_at: Date;
};
