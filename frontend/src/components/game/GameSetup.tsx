import { useState } from "react"

const CheckButton = ({_key, text, color, selected, clickHandler}:
		{_key: string, text: string, color: string, selected: string, clickHandler: (s: string) => void}
	) => (
	<button className={`font-pixelify border-solid border-2 py-1 w-48 rounded-full
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
				className={`px-2 py-1 w-32 border-solid border-textColor border-l-2 border-y-2
				rounded-l-full focus:outline-none shadow-buttonShadow`} />
			<button className={`px-2 py-1 border-solid border-textColor border-2 bg-buttonColor
				rounded-r-full focus:outline-none shadow-buttonShadow`}>
				invite
			</button>
		</div>
	)
}

const GameSetup = () => {
	const [difficulty, setDifficulty] = useState('easy')
	const [matchingType, setMatchingType] = useState('random')

	const difficultyHandeler = (diff: string) => {
		setDifficulty(diff)
	}

	const matchingTypeHandeler = (matching: string) => {
		setMatchingType(matching)
	}
	
	return (
		<div className={`h-[576px] sm:h-[324px] md:h-[389px] lg:h-[518px] xl:h-[648px] 2xl:h-[757px]
			border-solid border-textColor border-4 w-full justify-center
			flex flex-col gap-8 sm:gap-2 md:gap-6`}>

			<div className={`flex  flex-col gap-2 items-center justify-evenly`}>
				<CheckButton clickHandler={difficultyHandeler} text="easy" color="sucessColor" _key="easy" selected={difficulty} />
				<CheckButton clickHandler={difficultyHandeler} text="medium" color="secondary" _key="medium" selected={difficulty} />
				<CheckButton clickHandler={difficultyHandeler} text="hard" color="errorColor" _key="hard" selected={difficulty} />
			</div>
			<div className={`flex  flex-col gap-2 items-center justify-evenly`}>
				<CheckButton clickHandler={matchingTypeHandeler} text="Random" color="primary" _key="random" selected={matchingType} />
				<CheckButton clickHandler={matchingTypeHandeler} text="With a friend" color="[#9A73A6]" _key="friend" selected={matchingType} />
			</div>
			{matchingType === 'friend' ? <FindFriend /> : null}
			<div className={`flex  flex-col gap-2 items-center justify-evenly`}>
				<button className={`py-1 w-48 border-solid border-textColor border-2 bg-buttonColor
				rounded-full focus:outline-none font-pixelify shadow-buttonShadow`}>
					Start
				</button>
			</div>
		</div>
	)
}

export default GameSetup