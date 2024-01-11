import { createContext } from "react";

export interface IGameContext {
	game_id: string;
	issuer_id: number;
	receiver_id: number;
}

export const GameContext = createContext<[IGameContext | null, any]>([null, null])