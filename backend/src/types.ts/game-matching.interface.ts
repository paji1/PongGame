export enum EDifficulty {
	EASY = 'EASY',
	MEDIUM = 'MEDIUM',
	HARD = 'HARD',
}

export enum EMatchingType {
	RANDOM = 'RANDOM',
	INVITE = 'INVITE',
}

export interface IQueue {
	difficulty: EDifficulty,
	matchingType: EMatchingType,
	invite: string
}

export interface IInviting {
	user1_id: number,
	user1_nickname: string,
	user2_id: number,
	user2_nickname: string,
}
