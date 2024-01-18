import { game_modes } from "@prisma/client"
import * as Matter from "matter-js"
import { Socket } from "socket.io"

export default class Game {

	static readonly WIDTH: number = 320
	static readonly HEIGHT: number = 180
	
	static readonly BORDER_THICKNESS: number = 5
	static readonly BORDERS_OPTIONS = {
		friction: 0,
		frictionAir: 0,
		isStatic: true,
	}

	static readonly PADDLE_HEIGHT_RATIO = .25
	static readonly PADDLE_WIDTH_RATIO = .015

	static readonly BALL_RADIUS: number = 10
	static readonly BALL_OPTIONS = {
		restitution: 1,
		friction: 0,
		frictionAir: 0,
		mass: 0,
		inertia: Infinity
	}

	engine: Matter.Engine
	runner: Matter.Runner
	world: Matter.World
	ball: Matter.Body
	leftBorder: Matter.Body
	rightBorder: Matter.Body
	topBorder: Matter.Body
	bottomBorder: Matter.Body

	host_paddle: Matter.Body
	guest_paddle: Matter.Body

	host_socket: Socket
	guest_socket: Socket

	difficulty: game_modes
	number_of_players: number

	speed: number

	constructor(host_socket: Socket, guest_socket: Socket, difficulty: game_modes) {
		
		this.host_socket = host_socket
		this.guest_socket = guest_socket

		this.difficulty = difficulty
		this.number_of_players = 0

		this.speed = this.difficulty === game_modes.EASY ? 5 : this.difficulty === game_modes.MEDIUM ? 9 : 13

	}

	setup () {
		this.createEngine()
		this.createRunner()
		this.createWorld()
		this.createWalls()
		this.createPaddles()
		this.createBall()
		this.addToWorld()
	}

	createEngine () {
		this.engine = Matter.Engine.create({
			gravity: {x: 0, y: 0, scale: 0}
		})
	}
	
	createRunner () {
		this.runner = Matter.Runner.create({
			delta: 1000 / 60,
			isFixed: true
		})
	}

	createWorld () {
		this.world = this.engine.world
	}

	createBall () {
		const velocity = this.generateVector(this.generateAngle())
		this.ball = Matter.Bodies.circle(Game.WIDTH / 2, Game.HEIGHT / 2, Game.BALL_RADIUS, Game.BALL_OPTIONS)
		Matter.Body.setVelocity(this.ball, velocity)
	}

	createWalls () {
		this.leftBorder = Matter.Bodies.rectangle(2.5, Game.HEIGHT / 2, Game.BORDER_THICKNESS, Game.HEIGHT, Game.BORDERS_OPTIONS)
		this.rightBorder = Matter.Bodies.rectangle(Game.WIDTH - (Game.BORDER_THICKNESS / 2), Game.HEIGHT / 2, Game.BORDER_THICKNESS, Game.HEIGHT, Game.BORDERS_OPTIONS)
		this.topBorder = Matter.Bodies.rectangle(Game.WIDTH / 2, 2.5, Game.WIDTH, Game.BORDER_THICKNESS, Game.BORDERS_OPTIONS)
		this.bottomBorder = Matter.Bodies.rectangle(Game.WIDTH / 2, Game.HEIGHT - (Game.BORDER_THICKNESS / 2), Game.WIDTH, Game.BORDER_THICKNESS, Game.BORDERS_OPTIONS)
	}

	createPaddles () {
		let x = Game.WIDTH * Game.PADDLE_WIDTH_RATIO
		console.log(x, "left")
		this.host_paddle = Matter.Bodies.rectangle(x + 10, Game.HEIGHT / 2, Game.WIDTH * Game.PADDLE_WIDTH_RATIO, Game.HEIGHT *  Game.PADDLE_HEIGHT_RATIO, Game.BORDERS_OPTIONS)
		x = Game.WIDTH - Game.WIDTH * Game.PADDLE_WIDTH_RATIO - x
		console.log(x, "right")

		this.guest_paddle = Matter.Bodies.rectangle(x - 10, Game.HEIGHT / 2, Game.WIDTH * Game.PADDLE_WIDTH_RATIO, Game.HEIGHT *  Game.PADDLE_HEIGHT_RATIO, Game.BORDERS_OPTIONS)
	}

	addToWorld () {
		Matter.World.add(this.world, [this.ball, this.leftBorder, this.rightBorder, this.topBorder, this.bottomBorder, this.host_paddle, this.guest_paddle])
	}

	run () {
		Matter.Runner.run(this.runner, this.engine);

		const interval = setInterval(() => {
			if (!this.host_socket.connected || !this.host_socket.connected )
			{	
				console.log("game ended")
				clearInterval(interval)
				// TODO: game ending
				return ;
			}

			this.broadcast()
		}, 1000/ 60)
	}

	broadcast () {

			const ball_position = this.getBallPosition()
			
			console.log(this.bottomBorder.position);
			console.log(this.bottomBorder.bounds.max.x, this.bottomBorder.bounds.max.y);
			console.log(this.bottomBorder.bounds.min.x, this.bottomBorder.bounds.min.y);


			this.host_socket.emit('FRAME', {
				ball: {
					position: {
						x: ball_position.x,
						y: ball_position.y,
					}
				},
				MyPaddle: this.host_paddle.position,
				EnemyPaddle: this.guest_paddle.position,
			})

			this.guest_socket.emit('FRAME', {
				ball: {
					position: {
						x: Game.WIDTH -  ball_position.x,
						y: ball_position.y,
					}
				},
				MyPaddle: this.guest_paddle.position,
				EnemyPaddle: this.host_paddle.position,
			})
			// console.log(this.host_paddle.bounds.max.y  ,  "max paddle height")
			// console.log(this.host_paddle.bounds.min.y  ,  "min paddle height")
	}

	getBallPosition() {
		return this.ball.position
	}

	generateVector (angle: number) {
		const randian = angle * (Math.PI/180);
		return {
			x: Math.cos(randian) * this.speed,
			y: Math.sin(randian) * this.speed
		}
	}

	generateAngle () {
		let angle = Math.floor(Math.random() * 360)

		while (((angle < 120  && angle > 80) || (angle > 240  && angle < 300)) || 
				((angle > 340 && angle < 10) || (angle > 160 && angle < 200)))
			angle = Math.floor(Math.random() * 360)
		return angle
	}

	isValidPlayer (socket_id: string) {
		return this.host_socket.id === socket_id  || this.guest_socket.id === socket_id
	}

	
	setRecievedPaddlePos(socket_id: string, y:number)
	{
		if (this.host_socket.id === socket_id)
		{
			this.host_paddle.position.y = y;
		}
		
		if (this.guest_socket.id === socket_id)
		{
			this.guest_paddle.position.y = y;
		}
	}

}