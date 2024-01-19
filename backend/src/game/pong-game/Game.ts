import { EventEmitter2 } from "@nestjs/event-emitter"
import { game_modes } from "@prisma/client"
import { max } from "class-validator"
import * as Matter from "matter-js"
import { Socket } from "socket.io"

export default class Game {

	static readonly WIDTH: number = 1280
	static readonly HEIGHT: number = 960
	
	static readonly BORDER_THICKNESS: number = 20
	static readonly BORDERS_OPTIONS = {
		// restitution: 1,
		// friction: 0,
		// frictionAir: 0,
		isStatic: true,
		// inertia: Infinity,
		// frictionStatic: 0,
	}

	static readonly PADDLE_HEIGHT_RATIO = .15
	static readonly PADDLE_WIDTH_RATIO = .015

	static readonly BALL_RADIUS: number = 20
	static readonly BALL_OPTIONS = {
		restitution: 1,
		friction: 0,
		frictionAir: 0,
		mass: 0,
		inertia: Infinity
	}

	static readonly MAX_SCORE: number = 10

	event: EventEmitter2

	engine: Matter.Engine
	runner: Matter.Runner
	world: Matter.World
	ball: Matter.Body
	topBorder: Matter.Body
	bottomBorder: Matter.Body

	host_paddle: Matter.Body
	guest_paddle: Matter.Body

	paddle_height: number

	host_socket: Socket
	guest_socket: Socket

	host_id: number
	guese_id: number
	game_id: string

	host_score: number
	guest_score: number

	difficulty: game_modes
	number_of_players: number

	speed: number

	constructor(game_id: string, host_socket: Socket, guest_socket: Socket, difficulty: game_modes, host_id: number, guest_id: number, event: EventEmitter2) {
		
		this.host_socket = host_socket
		this.guest_socket = guest_socket

		this.difficulty = difficulty
		this.number_of_players = 0

		this.speed = this.difficulty === game_modes.EASY ? 10 : this.difficulty === game_modes.MEDIUM ? 20 : 30

		this.host_id = host_id
		this.guese_id = guest_id

		this.game_id = game_id

		this.host_score = 0
		this.guest_score = 0

		this.event = event
	}

	setup () {
		this.createEngine()
		this.createRunner()
		this.createWorld()
		this.createWalls()
		this.createPaddles()
		this.createBall()
		// this.collisions()
		this.addToWorld()
		this.paddle_height = this.getPaddleHeight()
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
		this.topBorder = Matter.Bodies.rectangle(Game.WIDTH / 2, 2.5, Game.WIDTH, Game.BORDER_THICKNESS, Game.BORDERS_OPTIONS)
		this.bottomBorder = Matter.Bodies.rectangle(Game.WIDTH / 2, Game.HEIGHT - (Game.BORDER_THICKNESS / 2), Game.WIDTH, Game.BORDER_THICKNESS, Game.BORDERS_OPTIONS)
	}

	createPaddles () {
		let x = Game.WIDTH * Game.PADDLE_WIDTH_RATIO
		this.host_paddle = Matter.Bodies.rectangle(x + 10, Game.HEIGHT / 2, Game.WIDTH * Game.PADDLE_WIDTH_RATIO, Game.HEIGHT *  Game.PADDLE_HEIGHT_RATIO, Game.BORDERS_OPTIONS)
		x = Game.WIDTH - Game.WIDTH * Game.PADDLE_WIDTH_RATIO

		this.guest_paddle = Matter.Bodies.rectangle(x - 10, Game.HEIGHT / 2, Game.WIDTH * Game.PADDLE_WIDTH_RATIO, Game.HEIGHT *  Game.PADDLE_HEIGHT_RATIO, Game.BORDERS_OPTIONS)
	}

	addToWorld () {
		Matter.World.add(this.world, [this.ball, this.topBorder, this.bottomBorder, this.host_paddle, this.guest_paddle])
	} 

	run () {
		Matter.Runner.run(this.runner, this.engine);

		const interval = setInterval(() => {
			if (!this.host_socket.connected || !this.guest_socket.connected )
			{
				this.clientDisconnect()
				clearInterval(interval)
				return ;
			}

			this.broadcast(interval)

		}, 20)
	}

	broadcast (interval: NodeJS.Timeout) {

			const ball_position = this.getBallPosition()

			if (this.ball.position.x <= 0)
				this.goal("LEFT", interval)
			else if (this.ball.position.x >= Game.WIDTH)
				this.goal("RIGHT", interval)

			this.host_socket.emit('FRAME', {
				ball: {
					position: {
						x: ball_position.x,
						y: ball_position.y,
					}
				},
				MyPaddle:
				{
					min : this.host_paddle.bounds.min,
					max : this.host_paddle.bounds.max
				},
				EnemyPaddle:
				{
					min : this.guest_paddle.bounds.min,
					max: this.guest_paddle.bounds.max,

				}
			})
			const mynpaddle =
			{
				min:
				{
					x:	this.host_paddle.bounds.min.x,
					y:	this.guest_paddle.bounds.min.y,
				},
				max:
				{
					x: this.host_paddle.bounds.max.x,
					y:this.guest_paddle.bounds.max.y,
				}
			}
			const myepaddle =
			{
				min:
				{
					x:	this.guest_paddle.bounds.min.x,
					y:	this.host_paddle.bounds.min.y,
				},
				max:
				{
					x: this.guest_paddle.bounds.max.x,
					y: this.host_paddle.bounds.max.y,
				}
			}
			this.guest_socket.emit('FRAME', {
				ball: {
					position: {
						x: Game.WIDTH -  ball_position.x,
						y: ball_position.y,
					}
				},
				MyPaddle: mynpaddle,
				EnemyPaddle: myepaddle
			})
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
			Matter.Body.set(this.host_paddle, "position", {x: this.host_paddle.position.x, y: y})
			// this.host_paddle.position.y = y;
		}
		
		if (this.guest_socket.id === socket_id)
		{
			Matter.Body.set(this.guest_paddle, "position", {x: this.guest_paddle.position.x, y: y})
		}
	}

	getPaddleWidth () {
		return this.host_paddle.bounds.max.x - this.host_paddle.bounds.min.x;
	}

	getPaddleHeight () {
		return this.host_paddle.bounds.max.y - this.host_paddle.bounds.min.y
	}

	reset () {
		const velocity = this.generateVector(this.generateAngle())
		Matter.Body.set(this.ball, "position", {x: Game.WIDTH / 2, y: Game.HEIGHT / 2})
		Matter.Body.setVelocity(this.ball, velocity)
	}

	goal (choice : string, interval: NodeJS.Timeout) {
		this.reset()
		if (choice === "LEFT") {
			this.guest_score++
			this.host_socket.emit('GOAL', {
				self: this.host_score,
				opp: this.guest_score
			})
			this.guest_socket.emit('GOAL', {
				self: this.guest_score,
				opp: this.host_score
			})
			if (this.guest_score >= Game.MAX_SCORE) {
				this.gameOver()
				clearInterval(interval)
			}
		} else if (choice === "RIGHT") {
			this.host_score++
			this.host_socket.emit('GOAL', {
				self: this.host_score,
				opp: this.guest_score
			})
			this.guest_socket.emit('GOAL', {
				self: this.guest_score,
				opp: this.host_score
			})
			if (this.host_score >= Game.MAX_SCORE) {
				this.gameOver()
				clearInterval(interval)
			}
		}
	}

	gameResults () {
		const isWinner = true
		if (this.host_score > this.guest_score) {
			this.host_socket.emit('GAME_OVER', {
				isWinner: isWinner
			})
			this.guest_socket.emit('GAME_OVER', {
				isWinner: !isWinner
			})
		}
		if (this.guest_score > this.host_score) {
			this.guest_socket.emit('GAME_OVER', {
				isWinner: isWinner
			})
			this.host_socket.emit('GAME_OVER', {
				isWinner: !isWinner
			})
		}
	}

	gameOver () {

	
		this.gameResults()
		const winner_id = this.host_score > this.guest_score ? this.host_id : this.guese_id
		const loser_id = this.host_score < this.guest_score ? this.guese_id : this.host_id
		this.event.emit('GAME_RESULT', this.game_id, winner_id, loser_id, this.host_score, this.guest_score)
		
		// TODO: update database accordingly
	}

	clientDisconnect () {
		let winner_id: number
		let loser_id: number
		if (this.host_socket.connected) {
			winner_id = this.host_id
			loser_id = this.guese_id
		} else {
			winner_id = this.guese_id
			loser_id = this.host_id
		}
		this.event.emit('GAME_RESULT', this.game_id, winner_id, loser_id, this.host_score, this.guest_score)
	}


}