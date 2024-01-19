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

	static readonly BALL_RADIUS: number = 5
	static readonly BALL_OPTIONS = {
		restitution: 1,
		friction: 0,
		frictionAir: 0,
		mass: 0,
		inertia: Infinity
	}

	static readonly MAX_SCORE: number = 10

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

	paddle_height: number

	host_socket: Socket
	guest_socket: Socket

	host_id: number
	guese_id: number

	host_score: number
	guest_score: number

	difficulty: game_modes
	number_of_players: number

	speed: number

	constructor(host_socket: Socket, guest_socket: Socket, difficulty: game_modes, host_id: number, guest_id: number) {
		
		this.host_socket = host_socket
		this.guest_socket = guest_socket

		this.difficulty = difficulty
		this.number_of_players = 0

		this.speed = this.difficulty === game_modes.EASY ? 5 : this.difficulty === game_modes.MEDIUM ? 9 : 13

		this.host_id = host_id
		this.guese_id = guest_id

		this.host_score = 0
		this.guest_score = 0
	}

	setup () {
		this.createEngine()
		this.createRunner()
		this.createWorld()
		this.createWalls()
		this.createPaddles()
		this.createBall()
		this.collisions()
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
		this.leftBorder = Matter.Bodies.rectangle(2.5, Game.HEIGHT / 2, Game.BORDER_THICKNESS, Game.HEIGHT, Game.BORDERS_OPTIONS)
		this.rightBorder = Matter.Bodies.rectangle(Game.WIDTH - (Game.BORDER_THICKNESS / 2), Game.HEIGHT / 2, Game.BORDER_THICKNESS, Game.HEIGHT, Game.BORDERS_OPTIONS)
		this.topBorder = Matter.Bodies.rectangle(Game.WIDTH / 2, 2.5, Game.WIDTH, Game.BORDER_THICKNESS, Game.BORDERS_OPTIONS)
		this.bottomBorder = Matter.Bodies.rectangle(Game.WIDTH / 2, Game.HEIGHT - (Game.BORDER_THICKNESS / 2), Game.WIDTH, Game.BORDER_THICKNESS, Game.BORDERS_OPTIONS)
	}

	createPaddles () {
		let x = Game.WIDTH * Game.PADDLE_WIDTH_RATIO
		this.host_paddle = Matter.Bodies.rectangle(x + 10, Game.HEIGHT / 2, Game.WIDTH * Game.PADDLE_WIDTH_RATIO, Game.HEIGHT *  Game.PADDLE_HEIGHT_RATIO, Game.BORDERS_OPTIONS)
		x = Game.WIDTH - Game.WIDTH * Game.PADDLE_WIDTH_RATIO - x

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
				return ;
			}

			this.broadcast()
		}, 1000/ 60)
	}

	broadcast () {

			const ball_position = this.getBallPosition()
			// console.log(" host paddle", this.host_paddle.position);
			// console.log(this.host_paddle.bounds.max.x,this.host_paddle.bounds.min.x );
			// console.log(this.host_paddle.bounds.max.y, this.host_paddle.bounds.min.y);
			
			 
			// console.log(" guestpaddle", this.guest_paddle.position);
			// console.log(this.guest_paddle.bounds.max.x,this.guest_paddle.bounds.min.x );
			// console.log(this.guest_paddle.bounds.max.y, this.guest_paddle.bounds.min.y);
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
				MyPaddle:
				{
					x: this.host_paddle.position.x,
					y: this.guest_paddle.position.y
				},
				EnemyPaddle:{
					x: this.guest_paddle.position.x,
					y: this.host_paddle.position.y
				}
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

	collisions () {

		Matter.Events.on(this.engine, 'collisionStart', (event) => this.onCollision(event))
	}

	onCollision (event) {

		const pairs = event.pairs

		for (const pair of pairs) {

			const obstacle = pair.bodyA !== this.ball ? pair.bodyA : pair.bodyB

			if (obstacle === this.leftBorder || obstacle === this.rightBorder)
				this.goal(obstacle)
			else continue
		}
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

	goal (obstacle) {
		if (obstacle === this.leftBorder) {
			this.guest_score++
			this.host_socket.emit('GOAL', {
				self: this.host_score,
				opp: this.guest_score
			})
			this.guest_socket.emit('GOAL', {
				self: this.guest_score,
				opp: this.host_score
			})
			if (this.guest_score >= Game.MAX_SCORE)
				this.gameOver()
		} else if (obstacle === this.rightBorder) {
			this.host_score++
			this.host_socket.emit('GOAL', {
				self: this.host_score,
				opp: this.guest_score
			})
			this.guest_socket.emit('GOAL', {
				self: this.guest_score,
				opp: this.host_score
			})
			if (this.host_score >= Game.MAX_SCORE)
				this.gameOver()
		}
	}

	gameOver () {
		const isWinner = true
		if (this.host_score > this.guest_score) {
			this.host_socket.emit('GAME_OVER', {
				isWinner: isWinner
			})
			this.guest_socket.emit('GAME_OVER', {
				isWinner: !isWinner
			})
			console.log('Host won!')
		}
		if (this.guest_score > this.host_score) {
			this.guest_socket.emit('GAME_OVER', {
				isWinner: isWinner
			})
			this.host_socket.emit('GAME_OVER', {
				isWinner: !isWinner
			})
			console.log('Guest won!')
		}
		// TODO: update database accordingly
		// TODO: clear interval
		// TODO: destroy the game
		// TODO: delete game from the map
	}

}