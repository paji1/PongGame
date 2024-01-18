import { useContext, useEffect, useRef, useState } from "react"
import { SocketContext } from "../Context/SocketContext";
import { Game } from "./GameLogic";
import { GameContext } from "../Context/GameContext";
import { EDifficulty } from "../Context/QueueingContext";
import { Socket } from "socket.io-client";

interface ICanvasDimensionsState {
	width: number;
	height: number;
}

const window_load_handler = (event: Event, canvas: any) => {
	console.log(`----> ${canvas.width}    ${canvas.height}`)
}

const window_resize_handler = (event: Event, canvas: any, context:any, parent: any) => {
	// canvas.width = parent.offsetWidth
	// canvas.height = parent.offsetHeight
	canvas.width = 320
	canvas.height = 180
}

const mousemove_handler = (event: any, game: Game, socket: Socket, game_id: string) => {
	// const x = event.
	let new_position = event.offsetY
	// if (new_position < game.getPaddleHeight() / 2)
	// 	new_position = game.getPaddleHeight() / 2
	// if (new_position > game.canvas_height - game.getPaddleHeight() / 2)
	// 	new_position = game.canvas_height - game.getPaddleHeight() / 2
	// game.setPaddlePosition(new_position, 'LEFT')
	
	socket.emit('PADDLE_POSITION', {
			'Why': new_position / (game.canvas.height / Game.HEIGHT_SCALE),
			'game_id': game_id
		})
}

export const PlayGround = () => {

	const parentRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const socket = useContext(SocketContext)
	const [gameContext, _] = useContext(GameContext)

	useEffect(() => {

		const canvas = canvasRef.current
		const parent = parentRef.current
		const context = canvas?.getContext("2d")
		const difficulty = gameContext?.difficulty

		if (!parent || !canvasRef || !canvas || !context || !difficulty || !gameContext)
		{
			console.log('zaaaaapi')
			return
		}
		const game = new Game(canvas, context, difficulty)

		socket.emit('GAME_READY', {
			game_id: gameContext?.game_id
		})

		socket.on('FRAME', (data) => {
			game.set_ball_position(data.ball.position.x, data.ball.position.y)
			game.myPaddle = data.MyPaddle
			game.enPaddle = data.EnemyPaddle
			console.log(game.myPaddle)
		})

		game.render()


		// canvas.width = parent.offsetWidth
		// canvas.height = parent.offsetHeight	
		canvas.width = 320
		canvas.height = 180
		window.addEventListener('load', (e) => window_load_handler(e, canvas))
		window.addEventListener('resize', (e) => window_resize_handler(e, canvas, context, parent))
		canvas.addEventListener('mousemove', (e) => mousemove_handler(e, game, socket, gameContext.game_id))
		

		return () => {
			socket.off('FRAME')
			window.removeEventListener('load', (e) => window_load_handler(e, canvas))
			window.removeEventListener('resize', (e) => window_resize_handler(e, canvas, context, parent))
			canvas.removeEventListener('mousemove', (e) => mousemove_handler(e, game, socket, gameContext.game_id))
		}

	}, [])

	return (
		<div ref={parentRef} className="bg-green-400 w-full h-full">
			{/* <canvas className={`w-full h-full`} ref={canvasRef}></canvas> */}
			<canvas  ref={canvasRef}></canvas>

		</div>
	)
}