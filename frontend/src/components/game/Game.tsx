import { useContext, useEffect, useRef } from "react"
import { DifficultyContext, EDifficulty } from "../Context/QueueingContext"
import { EASY_THEME, HARD_THEME, IDifficultyTheme, MEDIUM_THEME } from "./GameConfig"
import { SocketContext } from "../Context/SocketContext"
import { GameContext } from "../Context/GameContext"
import Game from "./GameLogic"
import { Socket } from "socket.io-client"
import Matter from "matter-js"

const render_canvas = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, theme: IDifficultyTheme) => {
	canvas.width = canvas.parentElement?.clientWidth || 0
	canvas.height = canvas.parentElement?.clientHeight || 0
	context.fillStyle = theme.background_color
	context.fillRect(0, 0, canvas.width, canvas.height);

}

let paddles = {
	hostpaddle: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	},
	guestpaddle: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	}
}

const init_canvas = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, game: Game, data: any) => {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	render_canvas(canvas, context, game.theme)
	if (canvas.clientWidth < canvas.clientHeight)
	{
		game.width_scale = canvas.clientWidth / data.scale_width
		game.height_scale = canvas.clientHeight / data.scale_height
	}
	else
	{
		game.width_scale = canvas.clientHeight / data.scale_height
		game.height_scale = canvas.clientWidth / data.scale_width
	}
	game.setBallVelocity(data.velocity.x, data.velocity.y);
	game.setBallPosition(data.ballX, data.ballY);
}

let score = 0
let opp_score = 0

const run = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, game: Game, socket: Socket) => {
	
	game.setup()
	function render() {
		
		context.clearRect(0, 0, game.canvas_width, game.canvas_height);
		render_canvas(canvas, context, game.theme)

		// Score
		context.font = '150px'
		context.fillStyle = game.theme.element_color
		context.textAlign = 'center'
		context.textBaseline = 'middle';
		const full_text = `${score} - ${opp_score}`
		context.fillText(full_text, canvas.clientWidth / 2, canvas.clientHeight / 2)
	
		// Draw the ball
		context.beginPath();
		context.arc(game.ball.position.x, game.ball.position.y, Game.BALL_RADIUS, 0, 2 * Math.PI);
		context.fillStyle = game.theme.element_color;
		context.fill();
		context.closePath();

		// Draw paddles
		// // Draw left paddle
		let paddleWidth = game.getPaddleWidth()
		let paddleHeight = game.getPaddleHeight()
		// context.beginPath();
		// context.rect(game.leftPaddle.position.x - paddleWidth / 2, game.leftPaddle.position.y - paddleHeight / 2, paddleWidth, paddleHeight);
		// context.fillStyle = game.theme.element_color;
		// context.fill();
		// context.closePath();
		// context.beginPath();
		// context.rect(game.rightPaddle.position.x - paddleWidth / 2, game.rightPaddle.position.y - paddleHeight / 2, paddleWidth, paddleHeight);
		// context.fillStyle = game.theme.element_color;
		// context.fill();
		// context.closePath();

		context.beginPath();
		context.rect(paddles.hostpaddle.x - paddleWidth / 2, paddles.hostpaddle.y - paddleHeight / 2, paddles.hostpaddle.width, paddles.hostpaddle.height);
		context.fillStyle = 'red'
		context.fill();
		context.closePath();

		context.beginPath();
		context.rect(paddles.guestpaddle.x - paddleWidth / 2, paddles.guestpaddle.y - paddleHeight / 2, paddles.guestpaddle.width, paddles.guestpaddle.height);
		context.fillStyle = 'red'
		context.fill();
		context.closePath();
	
		requestAnimationFrame(render);
	}

	render()

}

const PlayGround = () => {

	const [gameContext, setGameContext] = useContext(GameContext)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const socket = useContext(SocketContext)

	useEffect(() => {

		const canvas = canvasRef.current
		const context = canvas?.getContext("2d")
		if (!canvas || !context || !gameContext)
			return

		canvas.width = canvas.parentElement?.clientWidth || 0
		canvas.height = canvas.parentElement?.clientHeight || 0

		const game = new Game(gameContext.difficulty, canvas.width, canvas.height)
		render_canvas(canvas, context, game.theme)
		
		socket.on('INITIALIZE_GAME', (data: any) => {
			init_canvas(canvas, context, game, data)
		})
		
		socket.on('BALL_POSITION', (data: any) => {			
			game.setBallPosition(data.position.x, data.position.y)
			game.setBallVelocity(data.velocity.x, data.velocity.y)
			paddles = data.paddles
		})
		
		socket.on('PADDLE_POSITION', (data: any) => {
			game.setPaddlePosition(data.y, 'RIGHT')
		})

		socket.on('SCORE_UPDATE', (data) => {
			score = data.self
			opp_score = data.opp
		})
		
		window.addEventListener('resize', () => render_canvas(canvas, context, game.theme))
		canvas.addEventListener('mousemove', (event) => {
			let new_position = event.offsetY
			if (new_position < game.getPaddleHeight() / 2)
				new_position = game.getPaddleHeight() / 2
			if (new_position > game.canvas_height - game.getPaddleHeight() / 2)
				new_position = game.canvas_height - game.getPaddleHeight() / 2
			game.setPaddlePosition(new_position, 'LEFT')
			socket.emit('PADDLE_POSITION', {
					'paddleY': game.leftPaddle.position.y,
					'game_id': gameContext.game_id
				})
			})
			socket.emit('GAME_STARTED', {
				game_id: gameContext.game_id,
			})
			run(canvas, context, game, socket)
			
			return (
			() => {
				window.removeEventListener('resize', () => render_canvas(canvas, context, game.theme))
				socket.off('INITIALIZE_GAME')
				socket.off('BALL_POSITION')
				socket.off('PADDLE_POSITION')
				socket.off('SCORE_UPDATE')
			}
		)
	}, [])
	
	return (
		<div className={`sm:w-[533px] md:w-[640px] lg:w-[889px] xl:w-[1116px] 2xl:w-[1315px] w-[260px]
			sm:h-[300px] md:h-[360px] lg:h-[500px] xl:h-[628px] 2xl:h-[740px] h-[462px]
		`}>
			<canvas ref={canvasRef}></canvas>
		</div>
	)

}

export default PlayGround