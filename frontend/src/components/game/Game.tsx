import { useContext, useEffect, useRef, useState } from "react"
import { DifficultyContext, EDifficulty } from "../Context/QueueingContext"
import Matter from "matter-js"
import { EASY_THEME, HARD_THEME, IDifficultyTheme, MEDIUM_THEME } from "./GameConfig"
import { SocketContext } from "../Context/SocketContext"
import { GameContext } from "../Context/GameContext"
/**
 * - Server receives:
  * socket id
  * y-axis of the paddle

- Client receives
  * x, y-axis of the ball
  * y-axis of the opponent paddle
  * current match score
 */

const render_canvas = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, difficulty: EDifficulty) => {
	const THEME: IDifficultyTheme = difficulty === EDifficulty.EASY ? EASY_THEME : difficulty === EDifficulty.MEDIUM ? MEDIUM_THEME : HARD_THEME

	canvas.width = canvas.parentElement?.clientWidth || 0
	canvas.height = canvas.parentElement?.clientHeight || 0
	context.fillStyle = THEME.background_color
	context.fillRect(0, 0, canvas.width, canvas.height);

}

const run = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, difficulty: EDifficulty) => {

	/**
	 * Get qlawi dialk from background
	 */
	const BALL_RADIUS = 20
	const CANVAS_WIDTH = canvas.width
	const CANVAS_HEIGHT = canvas.height
	const WALL_THICKNESS = 1
	const MIN_THRESHOLD = .3

	const wall_options ={
		friction: 0,
		frictionAir: 0,
		isStatic: true
	}

	const engine = Matter.Engine.create();
	const world = engine.world;
	engine.gravity.scale = 0

	// Create walls
	const ground = Matter.Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT, CANVAS_WIDTH, WALL_THICKNESS, wall_options);
	const ceiling = Matter.Bodies.rectangle(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, WALL_THICKNESS, wall_options);
	const leftWall = Matter.Bodies.rectangle(0, CANVAS_HEIGHT / 2, WALL_THICKNESS, CANVAS_HEIGHT, wall_options);
	const rightWall = Matter.Bodies.rectangle(CANVAS_WIDTH, CANVAS_HEIGHT / 2, WALL_THICKNESS, CANVAS_HEIGHT, wall_options);

	// Create a ball
	const ball = Matter.Bodies.circle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, BALL_RADIUS, {
		restitution: 1,
		friction: 0,
		frictionAir: 0,
		mass: 0,
		inertia: Infinity
	});
	Matter.World.add(world, ball);
	const velX = [1, -1]
	const X = velX[Math.floor(Math.random() * 2)]
	var Y = (Math.random() - 0.5) * 2
	while (!(Y > MIN_THRESHOLD) && !(Y < -MIN_THRESHOLD))
		Y = Math.random()
	Matter.Body.setVelocity(ball, {x: X, y: Y})
	Matter.Body.setSpeed(ball, 15)

	Matter.World.add(world, [ground, ceiling, leftWall, rightWall]);

    // Run the engine
    Matter.Runner.run(engine);
	
	function render() {
		
		context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		render_canvas(canvas, context, difficulty)
		// Draw the ball
		context.beginPath();
		context.arc(ball.position.x, ball.position.y, BALL_RADIUS, 0, 2 * Math.PI);
		context.fillStyle = '#3498db';
		context.fill();
		context.closePath();
	
		// Draw the walls
		context.fillStyle = '#2c3e50';
		context.fillRect(ground.position.x - CANVAS_WIDTH / 2, ground.position.y - WALL_THICKNESS / 2, CANVAS_WIDTH, WALL_THICKNESS);
		context.fillRect(ceiling.position.x - CANVAS_WIDTH / 2, ceiling.position.y - WALL_THICKNESS / 2, CANVAS_WIDTH, WALL_THICKNESS);
		context.fillRect(leftWall.position.x - WALL_THICKNESS / 2, leftWall.position.y - CANVAS_HEIGHT / 2, WALL_THICKNESS, CANVAS_HEIGHT);
		context.fillRect(rightWall.position.x - WALL_THICKNESS / 2, rightWall.position.y - CANVAS_HEIGHT / 2, WALL_THICKNESS, CANVAS_HEIGHT);
	
		requestAnimationFrame(render);
	}

	render()

}

const PlayGround = () => {

	const [difficulty, _] = useContext(DifficultyContext)
	const [gameContext, setGameContext] = useContext(GameContext)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const socket = useContext(SocketContext)

	useEffect(() => {

		if (!gameContext)
			return 
		socket.emit('game_info_req', gameContext)
		console.log('game_info_req', gameContext)
		socket.on('game_info_res', (data: any) => {
			socket.emit('game_info_req', gameContext)
		})

		return () => {
			socket.off('game_info_res')
		}
	
	}, [gameContext])

	useEffect(() => {

		const canvas = canvasRef.current
		const context = canvas?.getContext("2d")
		if (!canvas || !context)
			return

		window.addEventListener('resize', () => render_canvas(canvas, context, difficulty))
		render_canvas(canvas, context, difficulty)
		run(canvas, context, difficulty)


		return (
			() => {
				window.removeEventListener('resize', () => render_canvas(canvas, context, difficulty))
				socket.off('game_info')
			}
		)
	}, [])
	
	return (
		<canvas ref={canvasRef}></canvas>
	)

}

export default PlayGround