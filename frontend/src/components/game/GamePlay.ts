const LINE_STROKE_WIDTH = 4
const ELEMENT_COLOR = 'white'
const FIELD_ELEMENT_COLOR = '#E6E7E9'

const SCREEN_SIZE_2XL = 1346
const SCREEN_SIZE_XL = 1152
const SCREEN_SIZE_LG = 921
const SCREEN_SIZE_MD = 691
const SCREEN_SIZE_SM = 576

//TODO: get the size of the screen and calculate the width and height of paddles and ball for more responsiveness

export class GamePlay {

	context: CanvasRenderingContext2D
	canvas: HTMLCanvasElement
	parent: HTMLDivElement
	static PADDLE_PADDDING_X: number
	width: number
	height: number
	paddleWidthResizeScale: number //TODO: this is will be calculated in the backend too


	constructor (parent: HTMLDivElement)
	{
		this.parent = parent;
		this.canvas = document.createElement('canvas')
		this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
		this.width = parent.offsetWidth
		this.height = parent.offsetHeight
		this.parent.appendChild(this.canvas)
		this.paddleWidthResizeScale = .01
		this.calculateResizeScale()
	}

	drawBall = (x: number, y: number, radius: number) => {
		this.context.beginPath()
		this.context.setLineDash([])
		this.context.arc(x, y, radius, 0, Math.PI * 2)
		this.context.fillStyle = ELEMENT_COLOR
		this.context.fill()
	}

	drawPaddle = (x: number, y: number, width: number, height: number) => {
		this.context.beginPath()
		this.context.setLineDash([])
		this.context.roundRect(x, y, width, height, [GamePlay.PADDLE_PADDDING_X])
		this.context.fillStyle = ELEMENT_COLOR
		this.context.fill()
	}

	initCanvasElements = () => {
		this.calculateResizeScale();
		// initialize ball
		this.drawBall(this.width / 2, this.height / 2, this.height / 40)

		// initialize user paddle
		let paddle_width = this.width * this.paddleWidthResizeScale
		let paddle_height = this.height * .15
		GamePlay.PADDLE_PADDDING_X = paddle_width / 2
		let paddle_x = 0 + GamePlay.PADDLE_PADDDING_X
		let paddle_y = (this.height / 2) - (paddle_height / 2)
		this.drawPaddle(paddle_x, paddle_y, paddle_width, paddle_height)
		
		// initialize opponent paddle
		paddle_width = this.width * this.paddleWidthResizeScale
		paddle_height = this.height * .15
		paddle_x = this.width - paddle_width - GamePlay.PADDLE_PADDDING_X
		paddle_y = (this.height / 2) - (paddle_height / 2)
		this.drawPaddle(paddle_x, paddle_y, paddle_width, paddle_height)
	}

	initCanvas = (background: string) => {
		// Init canvas
		this.canvas.width = this.width
		this.canvas.height = this.height
		this.context.fillStyle = background
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

		// Draw middle line
		this.context.beginPath()
		this.context.setLineDash([10])
		this.context.moveTo(this.width / 2, 0);
		this.context.lineTo(this.width / 2, this.height);
		this.context.lineWidth = LINE_STROKE_WIDTH
		this.context.strokeStyle = FIELD_ELEMENT_COLOR;
		this.context.stroke();

		// Draw middle circle
		this.context.beginPath();
		this.context.setLineDash([10])
		this.context.arc(this.width / 2, this.height / 2, this.height / 6, 0, Math.PI * 2)
		this.context.lineWidth = LINE_STROKE_WIDTH
		this.context.strokeStyle = FIELD_ELEMENT_COLOR
		this.context.stroke()

		// Draw middle disk
		this.context.beginPath();
		this.context.setLineDash([])
		this.context.arc(this.width / 2, this.height / 2, this.height / 70, 0, Math.PI * 2)
		this.context.fillStyle = FIELD_ELEMENT_COLOR
		this.context.fill()

		this.initCanvasElements()

		this.canvas.addEventListener('mousemove', (e: MouseEvent) => this.mouseMoveHandler(e))
	}

	detachCanvas = () => {
		this.parent.removeChild(this.canvas)
	}

	calculateResizeScale = () => {
		const width = this.canvas.width
		const height = this.canvas.height

		if (width > SCREEN_SIZE_2XL)
			this.paddleWidthResizeScale = .01
		else if (width <= SCREEN_SIZE_2XL && width > SCREEN_SIZE_XL)
			this.paddleWidthResizeScale = .01
		else if (width <= SCREEN_SIZE_XL && width > SCREEN_SIZE_LG)
			this.paddleWidthResizeScale = .012
		else if (width <= SCREEN_SIZE_LG && width > SCREEN_SIZE_MD)
			this.paddleWidthResizeScale = .015
		else if (width <= SCREEN_SIZE_MD && width > SCREEN_SIZE_SM)
			this.paddleWidthResizeScale = .018
		else
			this.paddleWidthResizeScale = .021
	}

	screenResizingHandler = (background: string) => {
		this.width = this.parent.offsetWidth
		this.height = this.parent.offsetHeight
		this.initCanvas(background)
	}

	mouseMoveHandler = (event: MouseEvent) => {
		/**
		 * //TODO:
		 * HERE WHERE TO SEND COORDS of BALL, USERS PADDLE and OPPONENTS PADDLE to THE SERVER via WEB SOCKET
		 */
		console.log('--> mousemove X: ' + event.offsetX)
		console.log('--> mousemove Y: ' + event.offsetY)
	}

	start = (background: string) => {
		this.initCanvas(background)
	}

}