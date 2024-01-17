import { game_modes } from "@prisma/client"
import { Socket } from "dgram"
import * as Matter from "matter-js"
import { BroadcastOperator } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

export default class Game {

	static readonly BALL_RADIUS = 20
	static readonly MAX_SCORE = 10

	static readonly WALL_THICKNESS = 1
	static readonly PADDLE_HEIGHT_RATIO = .25
	static readonly PADDLE_WIDTH_RATIO = .015

	static readonly WALLS_OPTIONS = {
		friction: 0,
		frictionAir: 0,
		isStatic: true,
		sensors: true
	}

	static readonly BALL_OPTIONS = {
		restitution: 1,
		friction: 0,
		frictionAir: 0,
		mass: 0,
		inertia: Infinity,
		sensors: true
	}

	game_id: string
	host_id: string // Host is left paddle
	guest_id: string // Guest is right paddle
	room: BroadcastOperator<DefaultEventsMap, any>

	host_score: number // Host is left paddle
	guest_score: number // Guest is right paddle

	width: number
	height: number
	speed: number

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

	constructor(game_id: string, difficulty: game_modes, game_room: BroadcastOperator<DefaultEventsMap, any>, socket_id1: string, socket_id2: string) {
		this.game_id = game_id
		
		this.width = 889  // 889
		this.height = 500 // 500
		this.speed = difficulty === game_modes.EASY ? 8 : difficulty === game_modes.MEDIUM ? 11 : 15

		this.room = game_room
		this.host_id = socket_id1
		this.guest_id = socket_id2

		this.host_score = 0
		this.guest_score = 0
	}

	async setup() {
		this.createWorld()
		this.createWalls()
		this.createBall()
		this.createPaddles()
		this.collision()
		Matter.Runner.run(this.runner, this.engine);
	
		setInterval(() => {
			const position = this.getBallPosition()
			let velocity = this.ball.velocity
			if (velocity.y >= -.1 && velocity.y <= .1)
			{
				if (velocity.y < 0)
					Matter.Body.setVelocity(this.ball, {x: this.ball.velocity.x, y: -.2})
				if (velocity.y >= 0)
					Matter.Body.setVelocity(this.ball, {x: this.ball.velocity.x, y: .2})
			}
			velocity = this.ball.velocity
			this.room.except(this.host_id).emit('BALL_POSITION', {
				position: {
					x: position.x, y: position.y
				},
				velocity: {
					x: velocity.x, y: velocity.y
				},
				paddles: {
					hostpaddle: {
						x: this.leftPaddle.position.x,
						y: this.leftPaddle.position.y,
						width: this.width * Game.PADDLE_WIDTH_RATIO,
						height: this.height *  Game.PADDLE_HEIGHT_RATIO
					},
					guestpaddle: {
						x: this.rightPaddle.position.x,
						y: this.rightPaddle.position.y,
						width: this.width * Game.PADDLE_WIDTH_RATIO,
						height: this.height *  Game.PADDLE_HEIGHT_RATIO
					}
				}
			})
			this.room.except(this.guest_id).emit('BALL_POSITION', {
				position: {
					x: this.width - position.x, y: position.y
				},
				velocity: {
					x: -velocity.x, y: velocity.y
				},
				paddles: {
					guestpaddle: {
						x: this.leftPaddle.position.x,
						y: this.leftPaddle.position.y,
						width: this.width * Game.PADDLE_WIDTH_RATIO,
						height: this.height *  Game.PADDLE_HEIGHT_RATIO
					},
					hostpaddle: {
						x: this.rightPaddle.position.x,
						y: this.rightPaddle.position.y,
						width: this.width * Game.PADDLE_WIDTH_RATIO,
						height: this.height *  Game.PADDLE_HEIGHT_RATIO
					}
				}
			})
			
		}, 16)

		return Matter.Body.getVelocity(this.ball)
	}

	createPaddle (x: number) {
		const paddle = Matter.Bodies.rectangle(x, this.height / 2, this.width * Game.PADDLE_WIDTH_RATIO, this.height *  Game.PADDLE_HEIGHT_RATIO, Game.WALLS_OPTIONS)
		return paddle
	}

	createPaddles () {
		let x = this.width * Game.PADDLE_WIDTH_RATIO
		this.leftPaddle = this.createPaddle(x)
		x = this.width - this.width * Game.PADDLE_WIDTH_RATIO
		this.rightPaddle = this.createPaddle(x)
		Matter.World.add(this.world, [this.leftPaddle, this.rightPaddle])
	}

	collision () {
		Matter.Events.on(this.engine, 'collisionStart', (event) => { // TODO: turn off this event listener in end game

			const pairs = event.pairs

			for (const pair of pairs) {

				const wall = pair.bodyA === this.ball ? pair.bodyB : pair.bodyA

				if (wall === this.leftWall) {
					this.guest_score++;
					if (this.guest_score >= Game.MAX_SCORE) {
						// TODO: end game guest wins
					}
				} else if (wall === this.rightWall) {
					this.host_score++
					if (this.host_score >= Game.MAX_SCORE) {
						// TODO: end game host wins
					}
					this.room.to(this.game_id).except(this.host_id).emit('SCORE_UPDATE', {
						self: this.guest_score,
						opp: this.host_score
					})
					this.room.to(this.game_id).except(this.guest_id).emit('SCORE_UPDATE', {
						self: this.host_score,
						opp: this.guest_score
					})
				} else continue ;
			}

			const velocity = this.getBallVelocity()
			const position = this.getBallPosition();
			this.room.except(this.host_id).emit('COLLISION_ACCURED', {velocity, position})
			this.room.except(this.guest_id).emit('COLLISION_ACCURED', {
				velocity: { 
					x: -velocity.x,
					y: velocity.y
				}, 
				position: {
					x: this.width - position.x, 
					y: position.y
				}
			})
		}) 
	}

	createWorld () {
		this.engine = Matter.Engine.create({
			gravity: {x: 0, y: 0, scale: 0}
		})
		this.world = this.engine.world
		this.runner = Matter.Runner.create({
			delta: 1000 / 60,
			isFixed: true
		})
	}

	createWalls () {
		this.ceiling = Matter.Bodies.rectangle(this.width / 2, 0, this.width, Game.WALL_THICKNESS, Game.WALLS_OPTIONS)
		this.ground = Matter.Bodies.rectangle(this.width / 2, this.height - Game.WALL_THICKNESS, this.width, Game.WALL_THICKNESS, Game.WALLS_OPTIONS)
		this.leftWall = Matter.Bodies.rectangle(0, this.height / 2, Game.WALL_THICKNESS, this.height, Game.WALLS_OPTIONS)
		this.rightWall = Matter.Bodies.rectangle(this.width - Game.WALL_THICKNESS, this.height / 2, Game.WALL_THICKNESS, this.height, Game.WALLS_OPTIONS)
		const walls = [
			this.ground,
			this.ceiling,
			this.leftWall,
			this.rightWall,
		]
		Matter.World.add(this.world, walls)
	}

	createBall () {
		const vel = this.generateVector(this.generateAngle())
		this.ball = Matter.Bodies.circle(this.width / 2, this.height / 2, Game.BALL_RADIUS, Game.BALL_OPTIONS);
		vel.x = vel.x * this.speed
		vel.y = vel.y * this.speed
		Matter.World.add(this.world, this.ball)
		Matter.Body.setVelocity(this.ball, vel)
	}

	generateVector (angle: number) {
		const randian = angle * (Math.PI/180);
		return {
			x: Math.cos(randian),
			y: Math.sin(randian)
		}
	}

	generateAngle () {
		let angle = Math.floor(Math.random() * 360)

		while (((angle < 120  && angle > 80) || (angle > 240  && angle < 300)) || 
				((angle > 340 && angle < 10) || (angle > 160 && angle < 200)))
			angle = Math.floor(Math.random() * 360)
		return angle
	}

	setBallVelocity(x: number, y: number) {
		Matter.Body.setVelocity(this.ball, {x, y})
	}

	getBallVelocity() {
		return Matter.Body.getVelocity(this.ball)
	}

	getBallPosition() {
		return this.ball.position
	}

	setPaddlePosition (y: number, choice: string) {

		console.log("hello ", y, "chice", choice)
		if (choice === 'LEFT')
			Matter.Body.setPosition(this.leftPaddle, {x: this.leftPaddle.position.x, y: y});
		else
			Matter.Body.setPosition(this.rightPaddle, {x: this.rightPaddle.position.x, y: y});
	}
}