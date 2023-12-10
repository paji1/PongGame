

const PointsScreen = ({direction}: {direction: string}) => {
	return (
		<div className={`w-1/3 h-full bg-buttonColor rounded-[20%] bg-opacity-[90%] absolute 
			${direction === 'right' ? 'right-[92%]' : 'left-[92%]'}
		`}>

		</div>
	)
}

const Paddle = ({side, position}: {side: string, position: {zbi: string}}) => {
	return (
		<div id={`paddle-${side}`}
			className={`bg-background h-[20%] w-2 rounded-full absolute lg:w-3
				${side === 'right' ? 'right-1' : 'left-1'}`}
		></div>
	)
}

const Ball = () => {
	return (
		<div id="ball"
			className={`w-3 h-3 lg:w-5 lg:h-5 right-1/2 top-1/2 bg-background absolute rounded-full`}
		></div>
	)
}

const PlayGround = () => {
	const position = {zbi: 'test'}
	return (
		<div className={`absolute p-1 w-3/4 h-3/4 top-[12.5%] right-[12.5%] bg-secondary bg-opacity-[85%] rounded-lg`}>
			<Ball />
			<Paddle side="right" position={position} />
			<Paddle side="left" position={position} />
		</div>
	)
}

const GameField = () => {

	return (
		<div className="w-full h-full bg-sucessColor overflow-hidden relative">
			<PointsScreen direction="right" />
			<PlayGround />
			<PointsScreen direction="left" />
		</div>
	)
}

export default GameField