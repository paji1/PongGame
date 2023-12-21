import { createContext } from "react"

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

export type ADifficultyHandle = (s: EDifficulty) => any
export type AMatchingHandle = (s: EMatchingType) => void

export const DifficultyContext = createContext<[EDifficulty, any]>([EDifficulty.EASY, null])