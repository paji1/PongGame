import { Histo } from "../../../types/yearlyres";
import HistoryMatch from "../matchHistory/HistoryComponent";

export default function History({ History }: { History: Histo[] | null }) {
	return (
		<div className="min-[0px]:mx-5 2xl:m-auto max-w-[1536px] flex min-[0px]:flex-col justify-content-evenly border-solid border-4 border-black 2xl:w-full shadow-[2px_4px_0px_0px_#000301] p-10 gap-y-8">
			<h1 className="min-[0px]:text-lg xl:text-2xl text-3xl text-center font-Nova font-black mb-1 border-solid border-4 p-6 bg-white shadow-[2px_4px_0px_0px_#000301]">
				PONG HISTORY
			</h1>
			<div className="Ft flex min-[0px]:flex-col border-solid border-4 border-black p-8 shadow-[2px_4px_0px_0px_#000301]">
				<div className="flex flex-col gap-x-8 overflow-y-auto max-h-[60rem] rr FF gap-y-14 cursor-row-resize">
					{History?.length ? (
						History.map((match: Histo) => (
							<HistoryMatch
								player1={match.player1_id.nickname}
								player2={match.player2_id.nickname}
								one={match.score1}
								two={match.score2}
								pic1={match.player1_id.avatar}
								pic2={match.player2_id.avatar}
							/>
						))
					) : (
						<p className="text-center min-[0px]:text-lg xl:text-2xl text-3xl font-Nova text-[#959490] font-extrabold animate-pulse"> No History Yet!</p>
					)}
				</div>
			</div>
		</div>
	);
}
