import * as Matter from "matter-js";
import Ball from "./Ball";
import Paddle from "./Paddle";
import { game_modes } from "@prisma/client";


export default class Game {

	static readonly CANVAS_WIDTH = 600
	static readonly CANVAS_HEIGHT = 600
	static readonly BALL_RADIUS = 20

	static readonly EASY_SPEED = 8
	static readonly MEDIUM_SPEED = 12
	static readonly HARD_SPEED = 15

	static readonly WALL_THICKNESS = 1

	static readonly WALLS_OPTIONS = {
		friction: 0,
		frictionAir: 0,
		isStatic: true
	}
 
	id: string
	player1: number
	player2: number
	timestamp: Date
	ball: Ball
	paddle1: Paddle
	paddle2: Paddle
	difficulty: game_modes
	/** MATTER JS */
	engine: Matter.Engine
	world: Matter.World
	ground: any
	ceiling: any
	leftWall: any
	rightWall: any

	constructor(game_id: string, difficulty: game_modes, id1: number, id2: number) {
		this.id = game_id;
		this.difficulty = difficulty;
		this.player1 = id1
		this.player2 = id2
		this.timestamp = new Date();
	}

	setup() {
		/**
		 * Set up the game
		 */
		this.engine = Matter.Engine.create();
		this.world = this.engine.world
		this.engine.gravity.scale = 0
		this.ground = Matter.Bodies.rectangle(Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT, Game.CANVAS_WIDTH, Game.WALL_THICKNESS, Game.WALLS_OPTIONS);
		this.ceiling = Matter.Bodies.rectangle(Game.CANVAS_WIDTH / 2, 0, Game.CANVAS_WIDTH, Game.WALL_THICKNESS, Game.WALLS_OPTIONS);
		this.leftWall = Matter.Bodies.rectangle(0, Game.CANVAS_HEIGHT / 2, Game.WALL_THICKNESS, Game.CANVAS_HEIGHT, Game.WALLS_OPTIONS);
		this.rightWall = Matter.Bodies.rectangle(Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT / 2, Game.WALL_THICKNESS, Game.CANVAS_HEIGHT, Game.WALLS_OPTIONS);
		/**
		 * Set up the ball
		 */
		const ballSpeed = this.difficulty === game_modes.EASY ? Game.EASY_SPEED : this.difficulty === game_modes.MEDIUM ? Game.MEDIUM_SPEED : Game.HARD_SPEED
		this.ball = new Ball(Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2, Game.BALL_RADIUS, ballSpeed)

		const velX = [1, -1]
		const X = velX[Math.floor(Math.random() * 2)]
		var Y = (Math.random() - 0.5) * 2
		while (!(Y > Ball.MIN_THRESHOLD) && !(Y < -Ball.MIN_THRESHOLD))
			Y = Math.random()
		Matter.Body.setVelocity(this.ball.ball, {x: X, y: Y})
		Matter.Body.setSpeed(this.ball.ball, 15)

		Matter.World.add(this.world, [this.ball.ball, this.ground, this.ceiling, this.leftWall, this.rightWall]);
		Matter.Runner.run(this.engine);
	}

	run () {
		const to_send = {
			ball: {
				x: this.ball.ball.position.x,
				y: this.ball.ball.position.y,
			},
			walls: {
				ground: {
					x: this.ground.position.x,
					y: this.ground.position.y
				},
				ceiling: {
					x: this.ceiling.position.x,
					y: this.ceiling.position.y
				},
				leftWall: {
					x: this.leftWall.position.x,
					y: this.leftWall.position.y
				},
				rightWall: {
					x: this.rightWall.position.x,
					y: this.rightWall.position.y
				}
			}
		}
		return to_send
	}

}
