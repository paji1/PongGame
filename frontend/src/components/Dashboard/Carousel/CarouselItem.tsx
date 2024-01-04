export const items = [
	{
		description: "Register in the app",
		title: "JOINING THE TEAM",
		icon: require("../../../assets/Throphy-01.png"),
	},
	{
		description: "Make the first win",
		title: "FIRST WIN",
		icon: require("../../../assets/Throphy-02.png"),
	},
	{
		description: "Add first friend",
		title: "BE-FRIENDER",
		icon: require("../../../assets/Throphy-03.png"),
	},
	{
		description: "Complete a combo of 3 consecutive wins",
		title: "WILDIN 'OUT",
		icon: require("../../../assets/Throphy-04.png"),
	},
	{
		description: "Play a game in every single mode",
		title: "VERSATILE PONGER",
		icon: require("../../../assets/Throphy-05.png"),
	},
	{
		description: "Add 3 friends",
		title: "THE SOCIALISER",
		icon: require("../../../assets/Throphy-07.png"),
	},
	{
		description: "Win a game without conseiving a single goal",
		title: "THE WALL",
		icon: require("../../../assets/Throphy-08.png"),
	},
	{
		description: "Win a game in every single mode",
		title: "THE CHAMELEON",
		icon: require("../../../assets/Throphy-09.png"),
	},
	{
		description: "Manage to beat all your friends",
		title: "THE EXECUTIONER",
		icon: require("../../../assets/Throphy-10.png"),
	},
];

export default function Tooltip({ children, description }: { children: any; description: any }) {
	return (
		<div className="group relative min-[0px]:text-base md:text-2xl min-[0px]:flex min-[0px]:flex-col sm:block text-center">
			{children}
			<span className="absolute min-[0px]:-left-[50%] min-[0px]:-right-[50%] md:-top-2 scale-0 md:ml-7 p-2 rounded bg-JacobsBlueColor text-textColor min-[0px]:text-[11px] sm:text-[14px] md:text-[23px] group-hover:scale-100 ring-offset-[#FEE04A] ring-4 ease-in-out">
				{description}
			</span>
		</div>
	);
}

export const CarouselItem = ({ item }: { item: any }) => {
	return (
		<div className="snap-center m-auto carousel-item inline-flex flex-col place-items-center justify-around h-[345px]">
			<img
				className="carousel-img min-[0px]:w-[160px] min-[0px]:h-[190px] md:w-[280px] md:h-[340px] p-6 md:p-12 drop-shadow-[25px_30px_3px_rgba(0,0,0,0.40)]"
				src={item.icon}
			/>
			<h1 className="mb-12 w-full carousel-item selection:bg-buttonColor min-[0px]:text-xl xl:text-2xl font-Nova font-bold hover:duration-700 hover:ease-in-out delay-[510ms]">
				<Tooltip description={item.description}>{item.title}</Tooltip>
			</h1>
		</div>
	);
};
