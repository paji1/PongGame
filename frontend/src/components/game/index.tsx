import { useContext, useEffect, useRef, useState } from "react";
import GameSetup from "./GameSetup";
import { EGamePreparationState } from "../Context/QueueingContext";
import QueueLoader from "./QueueLoader";
import { SocketContext } from "../Context/SocketContext";
import {PlayGround} from "./Game";
import { useNavigate, useParams } from "react-router-dom";
import { ip } from "../../network/ipaddr";
import { toast } from "react-toastify";
import GameOver from "./GameOver";
import { currentUser } from "../Context/AuthContext";
import { GameContext } from "../Context/GameContext";

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

const PlayerInfo = ({isMe}: {isMe: boolean}) => {

	const user = useContext(currentUser)
	const [gameContext, setGameContext] = useContext(GameContext)

	return (
		<div className={`flex fle-row gap-x-2 md:gap-x-8 justify-center items-center ${!isMe ? 'flex-row-reverse' : ''}`}>
			<div className={`rounded-full overflow-hidden `}>
				<img className={`w-16`} src={isMe ? user?.avatar : gameContext?.opp.avatar} alt="" />
			</div>
			<div className={`hidden md:flex text-lg`}>
				{isMe ? user?.nickname : gameContext?.opp.nickname}
			</div>
		</div>
	)
}

const GameFooter = () => {

	const [gameContext, setGameContext] = useContext(GameContext)

	return (
		<div className={`border-solid border-textColor border-4 shadow-gameShadow h-22
		sm:w-[576px] md:w-[691px] lg:w-[921px] xl:w-[1152px] 2xl:w-[1346px] w-[281px]
		bg-textColor font-pixelify text-background flex items-center justify-center md:justify-between p-4
		rounded-b`}>
			<div className={`sm:flex sm:flex-row gap-1 sm:gap-4 lg:gap-10 py-2 hidden`}>
				{gameContext ? <PlayerInfo isMe={true} />: (<><ButtonComponent /><ButtonComponent /></>)}
			</div>
			<div className={`flex flex-col gap-3 p-4 box-border`}>
				<p className={`text-center capitalize text-xl`}>
					transcendence
				</p>
				<p className={`text-center capitalize`}>
					may the odds never be in your favor
				</p>
			</div>
			<div className={`sm:flex sm:flex-row gap-1 sm:gap-4 lg:gap-10 py-2 hidden `}>
				{gameContext ? <PlayerInfo isMe={false} /> : <ButtonComponent />}
			</div>
		</div>
	)
}


const GameNotAvailable = () => (
	<div>
		this game is not available...
	</div>
)

const GameBody = () => {

	const gameBodyRef = useRef(null)
	const [preparation, setPreparation] = useState(EGamePreparationState.CONFIG_STATE)
	const socket = useContext(SocketContext)
	const [isGameOver, setIsGameOver] = useState(false)
	const [isWinner, setIsWinner] = useState(false)
	const navigate = useNavigate()
	const [gameContext, setGameContext] = useContext(GameContext)

	const params = useParams()
	const [isSet, setIsSet] = useState(false)

	useEffect(() => {
		if (params.gameID)
		{
			(async () => {
				const res = await fetch(`http://${ip}3001/game/${params.gameID}`, {
					credentials: 'include',
					method: 'GET'
				})
				if (res.status !== 200)
				{
					toast.error("You are not allowed to enter this game")
					return
				}
				setIsSet(true)
			})()
		}
		else
			setIsSet(false)
	}, [params])

	useEffect(() => {
		socket.on('enter_queue', () => {
			setPreparation(EGamePreparationState.QUEUING_STATE)
		})

		socket.on('SUCCESSFUL_INVITE', () => {
			setPreparation(EGamePreparationState.QUEUING_STATE)
		})
		
		socket.on('GAME_INVITE_REFUSED', () => {
			setPreparation(EGamePreparationState.CONFIG_STATE)
			toast.info('ma mssalix')
		})

		socket.on('GAME_OVER', (data: any) => {
			navigate(`/game`)
			setGameContext(null)
			setPreparation(EGamePreparationState.GAME_OVER_STATE)
			setIsSet(false)
			setIsGameOver(!isGameOver)
			setIsWinner(data.isWinner)
			
		})

		return (
			() => {
				socket.off('enter_queue')
				socket.off('SUCCESSFUL_INVITE')
				socket.off('GAME_INVITE_REFUSED')
				socket.off('GAME_OVER')
				socket.emit('LEAVE_GAME', {game_id: gameContext?.game_id, opp: gameContext?.opp})
			}
		)
	}, [gameContext])

	return (
		<div ref={gameBodyRef} className={`border-[.5rem] border-solid border-textColor bg-textColor flex items-center justify-center
		sm:w-[576px] md:w-[691px] lg:w-[921px] xl:w-[1152px] 2xl:w-[1346px] w-[281px]
		sm:h-[324px] md:h-[389px] lg:h-[518px] xl:h-[648px] 2xl:h-[757px] h-[500px]`}>
		{
			isSet ? <PlayGround /> : 
				preparation === EGamePreparationState.CONFIG_STATE ? <GameSetup /> :
				preparation === EGamePreparationState.QUEUING_STATE ? <QueueLoader /> :
				preparation === EGamePreparationState.READY_STATE ? <PlayGround /> :
				preparation === EGamePreparationState.GAME_OVER_STATE ? <GameOver isWinner={isWinner} /> : <GameNotAvailable />
		}
		</div>
	)
}

const GameFrame = () => {

	return (
		<div className={`rounded-t rotate-90 sm:rotate-0 w-full h-full`}>
			
		</div>
	)
}

const GameUI = () => {

	return (
		<div id="game-ui" className={`flex flex-col items-center h-auto inset-0`}>
			<div className={`flex flex-col items-center p-1 sm:p-5 mt-6
				`}>
				<GameBody />
				<GameFooter />
			</div>
		</div>
	)
}

export default GameUI;