import Navbar from "../Navbar";
import NotificationBar from "../notifbar/NotificationBar";
import SideBar from "../sidebar/SideBar";
import GameField from "./Game";

const GameFooter = () => (
	<div className={`border-solid border-textColor border-4 shadow-gameShadow w-full h-10
	bg-textColor font-pixelify text-background flex items-center justify-center
	rounded-b`}>
		<p className={`text-center`}>
			zbi
		</p>
    </div>
)

const GameFrame = () => {

	return (
		<div className={`border-solid border-textColor border-4 shadow-gameShadow w-full
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
			<GameFrame />
			<GameFooter />
		</div>
	</div>
)

const GameMain = () => {
	return (
		<>
			<Navbar />
			<NotificationBar />
			<SideBar />
			<GameUI />
		</>
	)
}

export default GameMain;