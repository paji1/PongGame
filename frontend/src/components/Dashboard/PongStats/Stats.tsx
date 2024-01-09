import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Histo, state } from "../../../types/yearlyres";
import { useContext } from "react";
import { currentUser } from "../../Context/AuthContext";

export default function Stats({ History }: { History: Histo[] | null }) {
	const user = useContext(currentUser);
	if (!History || !user) return null;
	const datastat = new state();

	History.map((match) => {
		if (new Date(match.created_at).getFullYear() === new Date().getFullYear()) {
			if (user.id === match.winner_id) datastat.array[new Date(match.created_at).getMonth()][" WINS "] += 1;
			else datastat.array[new Date(match.created_at).getMonth()][" LOSES "] += 1;
		}
	});
	return (
		<div className="min-[0px]:mx-5 2xl:m-auto 2xl:w-full flex flex-col justify-center border-solid border-4 h-[850px] border-black max-w-[1536px] shadow-[2px_4px_0px_0px_#000301] p-20 pt-20 Ft gap-y-12">
			<h1 className="text-center min-[0px]:text-xl xl:text-2xl text-3xl font-Nova font-bold ring-black ring-4 min-[0px]:mx-5 2xl:m-auto p-6 w-full -mt-8 shadow-[2px_4px_0px_0px_#000301] bg-white">
				PONG STATS
			</h1>
			<div className="ring-black ring-4 min-[0px]:pr-8 min-[0px]:pl-0 2xl:pr-24 2xl:p-14 h-full min-[0px]:mx-5 2xl:m-auto w-full p-12 bg-white shadow-[2px_4px_0px_0px_#000301]">
				<ResponsiveContainer>
					<LineChart data={datastat.array}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" type="category" width={4} padding="gap" />
						<YAxis type="number" />
						<Tooltip />
						<Legend iconType="rect" iconSize={15} height={8} />
						<Line dataKey=" WINS " stroke="#24BEC8" strokeWidth={5} />
						<Line dataKey=" LOSES " stroke="#0076C0" strokeWidth={5} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
