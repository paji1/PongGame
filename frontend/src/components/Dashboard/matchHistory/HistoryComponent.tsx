function Score(props: any) {
	return (
		<div className="flex sm:justify-center sm:p-6 sm:gap-x-4 align-center justify-items-center min-[0px]:justify-end mr-2 ml-2 sm:mr-0 sm:ml-0">
			<div className="flex self-center min-[0px]:p-2 lg:p-4 justify-center ring-2 ring-black shadow-[4px_4px_0px_0px_#000301]">
				<h1 className="font-Nova min-[0px]:text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl">
					{props.score}
				</h1>
			</div>
		</div>
	);
}

function Player({ reverse, name, score, pic }: { reverse: boolean; name: string; score: number; pic: string }) {
	return (
		<div
			className={`flex justify-between ${
				reverse ? "flex-row-reverse" : "flex-row"
			} border-2 border-solid border-black md:gap-x-14 sm:p-4 p-2 align-center w-full lg:w-[40%] shadow-[2px_4px_0px_0px_#000301] sm:h-[6.5rem] bg-white`}
		>
			<img
				src={pic}
				className="Profil min-[0px]:w-[4rem] min-[0px]:h-[4rem] min-[0px]:hidden xl:block border-2 border-solid border-black md:ml-1 shadow-[2px_4px_0px_0px_#000301]"
			></img>
			<h1 className="font-Nova min-[0px]:text-left sm:text-center min-[0px]:text-sm sm:text-base lg:text-xl 2xl:text-2xl mr-2 ml-2 truncate sm:mt-4 uppercase font-bold">
				{name}
			</h1>
			<Score score={score} />
		</div>
	);
}

export default function HistoryMatch(props: any) {
	return (
		<div className="flex justify-evenly flex-col lg:flex-row gap-y-4">
			<Player reverse={false} name={props.player1} score={props.one} pic={props.pic1} />
			<Player reverse={true} name={props.player2} score={props.two} pic={props.pic2} />
		</div>
	);
}
