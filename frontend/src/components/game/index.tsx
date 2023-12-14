import Navbar from "../Navbar";
import NotificationBar from "../notifbar/NotificationBar";
import SideBar from "../sidebar/SideBar";
import GameField from "./Game";
import GameSetup from "./GameSetup";

const ButtonComponent = () => {
	return (
		<div className={`w-12 h-12 rounded-full bg-background flex items-center  justify-center
		shadow-md hover:cursor-pointer my-2`}>
			<div className={`bg-background w-[70%] h-[70%] rounded-full shadow-xl
			flex items-center  justify-center relative`}>
				<div className={`bg-[#e2e5e8] w-[70%] h-[70%] rounded-full  shadow-inner absolute`}></div>
				<div className={`bg-[#acadad] w-[12%] h-[12%] rounded-full  shadow-inner absolute top-0`}></div>
			</div>
		</div>
	)
}

const GameFooter = () => (
	<div className={`border-solid border-textColor border-4 shadow-gameShadow w-full h-22
	bg-textColor font-pixelify text-background flex items-center justify-evenly
	rounded-b`}>
		<div className={`flex flex-row gap-1 sm:gap-4 lg:gap-10 py-2`}>
			<ButtonComponent />
			<ButtonComponent />
		</div>
		<div>
			<p className={`text-center capitalize text-xl`}>
				transcendence
			</p>
			<p className={`text-center capitalize`}>
				may the odds be ever in your favor
			</p>
		</div>
		<div className={`md:flex md:flex-row gap-1 sm:gap-4 lg:gap-10 py-2 hidden `}>
			<ButtonComponent />
		</div>
		{/* <ButtonComponent /> */}
    </div>
)

const GameFrame = () => {

	return (
		<div className={`border-solid border-textColor border-[.5rem] w-full
		h-[576px] sm:h-[324px] md:h-[389px] lg:h-[518px] xl:h-[648px] 2xl:h-[757px]
		rounded-t `}>
			<GameField />
		</div>
	)
}

const GameUI = () => (
	<div id="game-ui" className={`flex flex-col items-center
		h-screen`}>
		<div className={`flex flex-col items-center p-1 sm:p-5 mt-6 inset-0
			w-[85%] sm:w-[576px] md:w-[691px] lg:w-[921px] xl:w-[1152px] 2xl:w-[1346px]`}>
			{/* <GameSetup /> */}
			<GameFrame />
			<GameFooter />
		</div>
	</div>
)

const GameMain = () => {
	return (
		<div className="overflow-hidden">
			<Navbar />
			<GameUI />
			<NotificationBar />
			<SideBar />
		</div>
	)
}

export default GameMain;