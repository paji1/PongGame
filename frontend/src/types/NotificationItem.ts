import IUser from "./User"

export interface INotificaion {
	inviteType: InviteType,
	initiator: IUser,
	inviteDate: Date,
	status: NotificationStatus
}

export enum InviteType {
	GAME,
	ROOM,
	FRIEND
}

export enum NotificationStatus {
    PENDING,
    ACCEPTED,
    DECLINED
}