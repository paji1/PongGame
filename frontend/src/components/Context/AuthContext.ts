import { createContext } from "react";

export interface CurrentUser {
	id: number;
	user42: string;
	nickname: string;
	avatar: string;
	status: string;
}

export const currentUser = createContext<CurrentUser | null>(null);
