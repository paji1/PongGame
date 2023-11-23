
export enum permission {
	chat,
	private,
	public,
	protected,
}
type member_filler = {
	avatar: string;
	nickname: string;
	user42: string;
};
 type member = {
	user_id: member_filler;
};
export type room = {
	id: number;
	name: string;
	roomtypeof: string;
	rooms_members: [member];
	created_at: Date;
};
export type rooms = {
	rooms: room;
};
