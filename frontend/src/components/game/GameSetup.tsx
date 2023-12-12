import { useEffect, useRef, useState } from "react"
import Lottie from "lottie-web"

const CheckButton = ({_key, text, color, selected, clickHandler}:
		{_key: string, text: string, color: string, selected: string, clickHandler: (s: string) => void}
	) => (
	<button className={`font-pixelify border-solid border-[.2rem] py-1 w-64 rounded-full
		${selected === _key ? `bg-${color} text-background border-textColor` : `border-${color} text-${color} bg-background`}
		hover:text-background hover:border-${color} hover:bg-${color} shadow-buttonShadow capitalize`}
		onClick={() => clickHandler(_key)}>
		{text}
	</button>
)

const FindFriend = () => {
	return (
		<div className={`flex flex-row items-center justify-center font-pixelify`}>
			<input type="text" placeholder="Who..."
				className={`px-2 py-1 w-44 border-solid border-textColor border-l-[.2rem] border-y-[.2rem]
				rounded-l-full focus:outline-none shadow-buttonShadow`} />
			<button className={`px-4 py-1 border-solid border-textColor border-[.2rem] bg-buttonColor
				rounded-r-full focus:outline-none shadow-buttonShadow`}>
				invite
			</button>
		</div>
	)
}

const ConfigElems = () => {
	const [difficulty, setDifficulty] = useState('easy')
	const [matchingType, setMatchingType] = useState('random')

	const difficultyHandeler = (diff: string) => {
		setDifficulty(diff)
	}

	const matchingTypeHandeler = (matching: string) => {
		setMatchingType(matching)
	}

	return (
		<div className={`flex flex-col lg:gap-8 md:gap-5 sm:gap-2 gap-8 border z-50`}>
			<div className={`flex  flex-col gap-2 items-center justify-evenly`}>
				<CheckButton clickHandler={difficultyHandeler} text="easy" color="sucessColor" _key="easy" selected={difficulty} />
				<CheckButton clickHandler={difficultyHandeler} text="medium" color="secondary" _key="medium" selected={difficulty} />
				<CheckButton clickHandler={difficultyHandeler} text="hard" color="errorColor" _key="hard" selected={difficulty} />
			</div>
			<div className={`flex flex-col gap-2 items-center justify-evenly`}>
				<CheckButton clickHandler={matchingTypeHandeler} text="Random" color="primary" _key="random" selected={matchingType} />
				<CheckButton clickHandler={matchingTypeHandeler} text="With a friend" color="[#9A73A6]" _key="friend" selected={matchingType} />
			</div>
			{matchingType === 'friend' ? <FindFriend /> : null}
			<div className={`flex  flex-col gap-2 items-center justify-evenly`}>
				<button className={`py-1 border-solid border-textColor border-[.2rem] bg-buttonColor
				rounded-full focus:outline-none font-pixelify shadow-buttonShadow w-64`}>
					Start
				</button>
			</div>
		</div>
	)
}

const AnimatedElement = () => {

	const container = useRef(null)

	useEffect(() => {
		if (container.current)
		{
			Lottie.loadAnimation({
				container: container.current,
				renderer: 'svg',
				loop: true,
				autoplay: true,
				animationData: require('../../assets/pongLottie.json'),
			})
		}
	}, [])

	return (
		<div className={`container overflow-hidden w-full h-full`} ref={container}></div>
	)
}

const GameSetup = () => {
		
	return (
		<div id="game-setup-frame" className={`h-[576px] sm:h-[324px] md:h-[389px] lg:h-[518px] xl:h-[648px] 2xl:h-[757px]
			border-solid border-textColor border-[.5rem] w-full justify-center items-center z-50
			flex flex-row`}>
				<div className={`flex w-1/2 h-full items-center justify-center`}>
					<ConfigElems />
				</div>
				<div className={`w-1/3 h-full items-center justify-center hidden lg:block`}>
					<AnimatedElement />
				</div>
		</div>
	)
}

export default GameSetup