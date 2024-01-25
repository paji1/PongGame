import IUser from "./User";

export type Histo = {
	id: string;
	player1_id: IUser;
	player2_id: IUser;
	score1: number;
	score2: number;
	winner_id: number;
	loser_id: number;
	mode: string;
	state: string;
	created_at: Date;
};

export type achived = {
	id?: number;
	name?: string;
	description?: string;
	won_xp?: number;
	created_at?: string;
};
export class state {
	array;
	constructor() {
		this.array = [
			{
				name: "JANUARY",
				" WINS ": 0,
				" LOSES ": 0,
			},
			{
				name: "FEBRUARY",
				" WINS ": 0,
				" LOSES ": 0,
			},
			{
				name: "MARCH",
				" WINS ": 0,
				" LOSES ": 0,
			},
			{
				name: "APRIL",
				" WINS ": 0,
				" LOSES ": 0,
			},
			{
				name: "MAY",
				" WINS ": 0,
				" LOSES ": 0,
			},
			{
				name: "JUNE",
				" WINS ": 0,
				" LOSES ": 0,
			},
			{
				name: "JULY",
				" WINS ": 0,
				" LOSES ": 0,
			},
			{
				name: "AUGUST",
				" WINS ": 0,
				" LOSES ": 0,
			},
			{
				name: "SEPTEMBER",
				" WINS ": 0,
				" LOSES ": 0,
			},
			{
				name: "OCTOBER",
				" WINS ": 0,
				" LOSES ": 0,
			},
			{
				name: "NOVEMBER",
				" WINS ": 0,
				" LOSES ": 0,
			},
			{
				name: "DECEMBER",
				" WINS ": 0,
				" LOSES ": 0,
			},
		];
	}
}
