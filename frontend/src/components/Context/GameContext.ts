import { createContext } from "react";
import { EDifficulty } from "./QueueingContext";

export interface IGameContext {
	game_id: string;
	issuer_id: number;
	receiver_id: number;
	difficulty: EDifficulty;
	is_host: boolean;
}

export const GameContext = createContext<[IGameContext | null, any]>([null, null])