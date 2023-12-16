import { createContext } from "react"

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
	invite?: string
}

export type ADifficultyHandle = (s: EDifficulty) => any
export type AMatchingHandle = (s: EMatchingType) => void

export const DifficultyContext = createContext<[EDifficulty, any]>([EDifficulty.EASY, null])