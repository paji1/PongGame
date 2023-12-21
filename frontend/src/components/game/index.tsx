import { useContext, useEffect, useRef } from "react";
import Navbar from "../Navbar";
import NotificationBar from "../notifbar/NotificationBar";
import SideBar from "../SideBar";
// import GameField from "./Game";
import GameSetup from "./GameSetup";
import { SocketContext } from "../Context/SocketContext";

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
	<div className={`border-solid border-textColor border-4 shadow-gameShadow h-22
	sm:w-[576px] md:w-[691px] lg:w-[921px] xl:w-[1152px] 2xl:w-[1346px] w-[281px]
	bg-textColor font-pixelify text-background flex items-center justify-evenly
	rounded-b`}>
		<div className={`sm:flex sm:flex-row gap-1 sm:gap-4 lg:gap-10 py-2 hidden`}>
			<ButtonComponent />
			<ButtonComponent />
		</div>
		<div className={`flex flex-col gap-3 p-4 box-border`}>
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
    </div>
)

const GameBody = ({isReady}: {isReady: boolean}) => {

	const gameBodyRef = useRef(null)

	return (
		<div ref={gameBodyRef} className={`border-[.5rem] border-solid border-textColor
		sm:w-[576px] md:w-[691px] lg:w-[921px] xl:w-[1152px] 2xl:w-[1346px] w-[281px]
		sm:h-[324px] md:h-[389px] lg:h-[518px] xl:h-[648px] 2xl:h-[757px] h-[500px]`}>
			{isReady ? null: <GameSetup />}
		</div>
	)
}

const GameFrame = () => {

	return (
		<div className={`rounded-t rotate-90 sm:rotate-0 w-full h-full`}>
			
		</div>
	)
}

const GameUI = () => (
	<div id="game-ui" className={`flex flex-col items-center h-auto inset-0`}>
		<div className={`flex flex-col items-center p-1 sm:p-5 mt-6
			`}>
			<GameBody isReady={false} />
			<GameFooter />
		</div>
	</div>
)

const GameMain = () => {
	const socket = useContext(SocketContext)

	return (
		<div className="">
			{/* <Navbar />
			<NotificationBar />
			<SideBar /> */}
			<GameUI />
		</div>
	)
}

export default GameMain;