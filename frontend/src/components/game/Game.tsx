import { useContext, useEffect, useRef, useState } from "react"
import { SocketContext } from "../Context/SocketContext";
import { Game } from "./GameLogic";
import { GameContext } from "../Context/GameContext";
import { Socket } from "socket.io-client";
import GameOver from "./GameOver";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ICanvasDimensionsState {
	width: number;
	height: number;
}

const window_resize_handler = (event: Event, canvas: any, context:any, parent: any) => {
	canvas.width = parent.offsetWidth
	canvas.height = parent.offsetHeight
}

const mousemove_handler = (event: any, game: Game, socket: Socket, game_id: string) => {
	let new_position = event.offsetY
	socket.emit('PADDLE_POSITION', {
			'Why': new_position / (game.canvas.height / Game.BACK_END_HEIGHT),
			'game_id': game_id
		})
}

export const PlayGround = () => {

	const parentRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const socket = useContext(SocketContext)
	const [gameContext, _] = useContext(GameContext)
	const [isGameOver, setIsGameOver] = useState(false)
	const [isWinner, setIsWinner] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {

		const canvas = canvasRef.current
		const parent = parentRef.current
		const context = canvas?.getContext("2d")
		const difficulty = gameContext?.difficulty

		if (isGameOver)
			return

		if (!parent || !canvasRef || !canvas || !context || !difficulty || !gameContext)
		{
			navigate(`/game`)
			toast.error("Something went wrong")
			return
		}
		const is_host = gameContext.is_host
		const game = new Game(canvas, context, difficulty, is_host)

		socket.emit('GAME_READY', {
			game_id: gameContext?.game_id
		})

		socket.on('FRAME', (data) => {
			game.set_ball_position(data.ball.position.x, data.ball.position.y)
			game.myPaddle = data.MyPaddle
			game.enPaddle = data.EnemyPaddle
		})

		socket.on('GOAL', (data) => {
			game.setPlayerScore(data.self)
			game.setOpponentScore(data.opp)
		})

		socket.on('GAME_OVER', (data: any) => {
			setIsGameOver(!isGameOver)
			setIsWinner(data.isWinner)
		})



		canvas.width = parent.offsetWidth
		canvas.height = parent.offsetHeight	
		window.addEventListener('resize', (e) => window_resize_handler(e, canvas, context, parent))
		canvas.addEventListener('mousemove', (e) => mousemove_handler(e, game, socket, gameContext.game_id))
		
		game.render()

		return () => {
			socket.off('FRAME')
			socket.off('GOAL')
			socket.off('GAME_OVER')
			window.removeEventListener('resize', (e) => window_resize_handler(e, canvas, context, parent))
			canvas.removeEventListener('mousemove', (e) => mousemove_handler(e, game, socket, gameContext.game_id))
		}

	}, [isGameOver])

	return (
		<div ref={parentRef} className="bg-textColor w-full h-full">
			{!isGameOver ? <canvas className="w-full h-full"  ref={canvasRef}></canvas> : <GameOver isWinner={isWinner} />}
		</div>
	)
}