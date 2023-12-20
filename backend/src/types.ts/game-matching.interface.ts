export enum EDifficulty {
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard',
}

export enum EMatchingType {
	RANDOM = 'random',
	INVITE = 'invite',
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
