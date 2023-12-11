const MAX_SCORE = 7

const ScoreAnchor = ({isActive, direction}: {isActive: boolean, direction: string}) => (
	<div className={`w-5 h-5 lg:w-7 lg:h-7 xl:w-10 xl:h-10 rounded-full bg-primary
	${isActive ? 'bg-opacity-50' : ''}`
	}></div>
)

const pointsCalculator = (direction: string) => {
	const anchors = []
	for (let i = 0; i < MAX_SCORE; i++) {
		anchors.push(<ScoreAnchor key={i} isActive={i < 3 ? true : false} direction={direction} />)
	}
	return anchors
}

const PointsScreen = ({direction}: {direction: string}) => {
	return (
		<div className={`w-1/12 h-full bg-buttonColor bg-opacity-[90%] absolute 
			${direction === 'right' ? 'right-[92%] rounded-r-[35%]' : 'left-[92%] rounded-l-[35%]'}
			flex flex-col gap-2 lg:gap-4 justify-center items-center
			
		`}>
			{pointsCalculator(direction)}
		</div>
	)
}

const Paddle = ({side, position}: {side: string, position: {zbi: string}}) => {
	return (
		<div id={`paddle-${side}`}
			className={`bg-background h-[20%] w-2 rounded-full absolute
				lg:w-3 ${side === 'right' ? 'right-1' : 'left-1'}`}
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
		<div id="play-ground" className={`absolute w-3/4 h-3/4 top-[12.5%] right-[12.5%]
			bg-secondary bg-opacity-[85%] rounded-lg`}
			>
			<div className={`absolute w-1 h-full bg-sucessColor left-[49%]`}></div>
			<div className={`absolute w-[25%] h-[25%] rounded-full  left-[36.9%] top-[37.5%]
				border-[.25rem] border-solid border-sucessColor`}></div>
			<Ball />
			<Paddle side="right" position={position} />
			<Paddle side="left" position={position} />
		</div>
	)
}

const GameField = () => {

	return (
		<div className="w-full h-full bg-sucessColor overflow-hidden relative">
			<PlayGround />
			<PointsScreen direction="right" />
			<PointsScreen direction="left" />
		</div>
	)
}

export default GameField