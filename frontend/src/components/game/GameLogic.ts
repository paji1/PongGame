import * as Matter from "matter-js";
import { EDifficulty } from "../Context/QueueingContext";
import { EASY_THEME, HARD_THEME, IDifficultyTheme, MEDIUM_THEME } from "./GameConfig";


export default class Game {

	static readonly BALL_RADIUS = 20
	static readonly PADDLE_HEIGHT_RATIO = .25
	static readonly PADDLE_WIDTH_RATIO = .015
	static readonly MIN_THRESHOLD = .3

	static readonly EASY_SPEED = 8
	static readonly MEDIUM_SPEED = 12
	static readonly HARD_SPEED = 15

	static readonly WALL_THICKNESS = 1

	static readonly WALLS_OPTIONS = {
		friction: 0,
		frictionAir: 0,
		isStatic: true
	}

	static readonly PADDLES_OPTIONS = {
		friction: 0,
		frictionAir: 0,
		isStatic: true
	}

	static readonly BALL_OPTIONS = {
		restitution: 1,
		friction: 0,
		frictionAir: 0,
		mass: 0,
		inertia: Infinity
	}

	difficulty: EDifficulty
	theme: IDifficultyTheme
	/** MATTER JS */
	ball_speed: number
	canvas_width: number
	canvas_height: number
	width_scale: number
	height_scale: number

	engine: Matter.Engine
	world: Matter.World
	runner: Matter.Runner
	ground: any
	ceiling: any
	leftWall: any
	rightWall: any
	ball: any
	leftPaddle: any
	rightPaddle: any

	constructor(difficulty: EDifficulty, canvas_width: number, canvas_height: number) {
		this.difficulty = difficulty;
		this.ball_speed = this.difficulty === EDifficulty.EASY ? 8 :
			this.difficulty === EDifficulty.MEDIUM ? 11 : 15

		this.canvas_width = canvas_width
		this.canvas_height = canvas_height
		this.theme = difficulty === EDifficulty.EASY ? EASY_THEME : difficulty === EDifficulty.MEDIUM ? MEDIUM_THEME : HARD_THEME
		this.width_scale = 1
		this.height_scale = 1

		/**
		 * Create world object
		 */
		this.engine = Matter.Engine.create({
			gravity: {x: 0, y: 0, scale: 0}
		});
		this.world = this.engine.world
		this.runner = Matter.Runner.create({
			delta: 1000 / 60,
			isFixed: true
		})
	}

	setup() {
		this.createWalls()
		this.createBall()
		this.createPaddles()

		const render = Matter.Render.create({
			engine: this.engine,
			element: document.body,
			options: {
				width: 1315,
				height: 740
			}
		});
		  Matter.Render.run(render)
		  Matter.Runner.run(this.runner, this.engine);

	}

	createWorld () {
		this.engine = Matter.Engine.create({
			gravity: {x: 0, y: 0, scale: 0}
		});
		this.world = this.engine.world
		this.runner = Matter.Runner.create({
			delta: 1000 / 60,
			isFixed: true
		})
	}

	createWalls () {
		this.ceiling = Matter.Bodies.rectangle(this.canvas_width / 2, 0, this.canvas_width, Game.WALL_THICKNESS, Game.WALLS_OPTIONS)
		this.ground = Matter.Bodies.rectangle(this.canvas_width / 2, this.canvas_height - Game.WALL_THICKNESS, this.canvas_width, Game.WALL_THICKNESS, Game.WALLS_OPTIONS)
		this.leftWall = Matter.Bodies.rectangle(0, this.canvas_height / 2, Game.WALL_THICKNESS, this.canvas_height, Game.WALLS_OPTIONS)
		this.rightWall = Matter.Bodies.rectangle(this.canvas_width - Game.WALL_THICKNESS, this.canvas_height / 2, Game.WALL_THICKNESS, this.canvas_height, Game.WALLS_OPTIONS)
		const walls = [
			this.ground,
			this.ceiling,
			this.leftWall,
			this.rightWall,
		]
		Matter.World.add(this.world, walls)
	}

	createPaddle (x: number) {
		const paddle = Matter.Bodies.rectangle(x, this.canvas_height / 2, this.canvas_width * Game.PADDLE_WIDTH_RATIO, this.canvas_height *  Game.PADDLE_HEIGHT_RATIO, Game.WALLS_OPTIONS)
		return paddle
	}

	createPaddles () {
		let x = this.canvas_width * Game.PADDLE_WIDTH_RATIO
		this.leftPaddle = this.createPaddle(x)
		x = this.canvas_width - this.canvas_width * Game.PADDLE_WIDTH_RATIO
		this.rightPaddle = this.createPaddle(x)
		Matter.World.add(this.world, [this.leftPaddle, this.rightPaddle])
	}

	createBall () {
		this.ball = Matter.Bodies.circle(this.canvas_width / 2, this.canvas_height / 2, Game.BALL_RADIUS, Game.WALLS_OPTIONS);
		Matter.World.add(this.world, this.ball)
	}

	setBallVelocity(x: number, y: number) {
		Matter.Body.setVelocity(this.ball, {x, y})
	}

	setBallPosition(x: number, y: number) {
		Matter.Body.setPosition(this.ball, {x: x * this.width_scale, y: y * this.height_scale})
	}

	getPaddleWidth () {
		const width = this.leftPaddle.bounds.max.x - this.leftPaddle.bounds.min.x;
		return width
	}

	getPaddleHeight () {
		const bound = this.leftPaddle.bounds
		return bound.max.y - bound.min.y
	}

	setPaddlePosition (newPosition: number, choice: string) {
		const paddle = choice === "LEFT" ? this.leftPaddle : this.rightPaddle
		Matter.Body.setPosition(paddle, {x: paddle.position.x, y: newPosition})
	}

	getBallVelocity() {
		return Matter.Body.getVelocity(this.ball)
	}

	getBallPosition() {
		return this.ball.position
	}



}
