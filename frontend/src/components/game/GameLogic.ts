import { EDifficulty } from "../Context/QueueingContext";
import { EASY_THEME, HARD_THEME, IDifficultyTheme, MEDIUM_THEME } from "./GameConfig";

export class Game {

	static readonly BALL_RADIUS: number = 20
	static readonly BACK_END_WIDTH: number = 1280
	static readonly BACK_END_HEIGHT: number = 960

	static readonly H_RATIO = .15
	static readonly W_RATIO = .015
	



	theme: IDifficultyTheme
	width: number
	height: number
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D

	myPaddle: {
		min:{
			x:number,
			y:number
		},
		max:
		{
			x:number,
			y:number
		}
	}
		
	enPaddle: {
		min:{
			x:number,
			y:number
		},
		max:
		{
			x:number,
			y:number
		}
	}
		
	ball_position: {
		x: number
		y: number
	}

	host: boolean
	player_score: number
	opponent_score: number

	constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, difficulty: EDifficulty,ishost: boolean ) {


		this.canvas = canvas
		this.context = context
		this.width = this.canvas.width
		this.height = this.canvas.height;
		this.theme = difficulty === EDifficulty.EASY ? EASY_THEME : difficulty === EDifficulty.MEDIUM ? MEDIUM_THEME : HARD_THEME;
		
		this.host = ishost
		this.ball_position = {
			x: this.canvas.width / 2,
			y: this.canvas.height / 2
		}
		this.myPaddle = {
			min:{
				x:0,
				y:0
			},
			max:
			{
				x:0,
				y:0
			}
		}
		this.enPaddle = {
			min:{
				x:0,
				y:0
			},
			max:
			{
				x:0,
				y:0
			}
		}

		this.player_score = 0
		this.opponent_score = 0
	}

	set_ball_position (x: number, y: number) {
		this.ball_position.x = x
		this.ball_position.y = y
	}
			
	render () {
		const width_scale = (this.canvas.width) / 1280
		const height_scale = this.canvas.height / 960
	

		
		this.context.fillStyle = this.theme.background_color
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)


		// socre
		const score = `${this.player_score} - ${this.opponent_score}`
		this.context.font = '32pt Pixelify Sans';
		this.context.textAlign = 'center'; // Adjust as needed
		this.context.textBaseline = 'top'; // Adjust as needed
		this.context.fillStyle = this.theme.element_color;
		this.context.fillText(score, this.canvas.width / 2, 10); // Adjust the position (10, 10) as needed

		

		const paddleL = this.canvas.height * Game.H_RATIO;
		const paddeW = this.canvas.width * Game.W_RATIO;
		
		// Draw ball
		this.context.beginPath()
		this.context.arc((this.ball_position.x) * width_scale, (this.ball_position.y ) * height_scale, Game.BALL_RADIUS * height_scale , 0, 2 * Math.PI)
		this.context.fillStyle = this.theme.element_color
		this.context.fill()
		this.context.closePath()

		this.context.beginPath()
		this.context.rect(this.myPaddle.min.x * width_scale , this.myPaddle.min.y *height_scale, (this.myPaddle.max.x  - this.myPaddle.min.x)  *width_scale ,  (this.myPaddle.max.y  - this.myPaddle.min.y) *height_scale) //0.015 is Game.PADDLE_WIDTH_RATIO i the backend
		this.context.fillStyle = this.theme.element_color
		this.context.fill()
		this.context.beginPath()

		// enemypaddle
		this.context.beginPath()
		this.context.rect(this.enPaddle.min.x * width_scale , this.enPaddle.min.y *height_scale, (this.enPaddle.max.x  - this.enPaddle.min.x)  * width_scale ,  (this.enPaddle.max.y  - this.enPaddle.min.y) *height_scale) //0.015 is Game.PADDLE_WIDTH_RATIO i the backend
		this.context.fillStyle = this.theme.element_color
		this.context.fill()
		this.context.beginPath()
		
		requestAnimationFrame(() => this.render());
	}

	setPlayerScore(score: number) {
		this.player_score = score
	}

	setOpponentScore(score: number) {
		this.opponent_score = score
	}

}