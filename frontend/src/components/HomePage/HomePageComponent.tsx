import GameBoy from "../../assets/GameBoy.png";

export default function HomePageDiv() {
	return (
		<div className="bg-BkColor min-[0px]:flex-row lg:flex min-[0px]:mx-5 2xl:m-auto justify-between items-center border-solid border-4 border-black shadow-[2px_4px_0px_0px_#000301] box-border p-3 max-w-[1536px]">
			<div className="flex flex-col min-[0px]:place-items-center min-[1199px]:items-start min-[1199px]:w-full min-[0px]:p-5 xl:p-9 gap-y-11 lg:m-9 w-[auto]">
				<p className="animate-[pulse_2.6s_ease-in-out_infinite] TrTitle text-primary min-[0px]:text-center xl:text-left min-[0px]:m7 min-[0px]:px-6 min-[1199px]:m0 min-[1199px]:px-0 min-[0px]:text-4xl min-[545px]:text-6xl min-[1199px]:text-7xl font-pixelify">
					TRANSCENDENCE PINGPONG GAME
				</p>
				<p className="min-[0px]:text-xl min-[0px]:px-12 min-[1199px]:text-2xl min-[1199px]:px-0 font-Nova capitalize">
					Step back into the 90s with our website, a nostalgic trip to the world of ping-pong gaming. Relive
					the classic games, iconic moments, and the unique charm of that era. Whether you're a seasoned
					player or a curious newcomer, we're here to celebrate the enduring magic of 90s ping-pong.
				</p>
			</div>
			<div className="min-[0px]:hidden min-[1199px]:flex min-[1199px]:w-full m-4 flex place-content-center ">
				<img src={GameBoy} className="GameBoy" alt="pic" />
			</div>
		</div>
	);
}
