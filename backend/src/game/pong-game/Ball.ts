import * as Matter from "matter-js";

interface ICoordinate {
	x: number;
	y: number;
}

export default class Ball {

	

	public ball: any
	public speed: number;
	public time_stamp: number;

	constructor (x: number, y: number, radius: number, speed: number) {
		this.speed = speed;
		// this.ball = Matter.Bodies.circle(x, x, radius, Ball.BALL_OPTIONS);
	}

}