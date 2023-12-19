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
	id: number,
	roomid:number,
	permission:string,
	isblocked:boolean,
	ismuted:boolean,
	isBanned:boolean,
	created_at:Date,
	user_id: member_filler;
};

export type room = {
	messages: messages[]
	id: number;
	name: string;
	roomtypeof: string;
	rooms_members: member[];
	created_at: Date;
};
