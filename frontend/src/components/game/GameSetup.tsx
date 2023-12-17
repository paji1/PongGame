import { useContext, useEffect, useRef, useState } from "react"
import { EDifficulty, EMatchingType, IQueue, ADifficultyHandle, AMatchingHandle, DifficultyContext } from "../Context/QueueingContext"
import Lottie from "lottie-web"
import { SocketContext } from "../Context/SocketContext"

const queueingQuery = (queueing: IQueue, inviteUsername?: string): boolean => {

	const isValidInput = (input: string): boolean => {
		const regex = /^[a-zA-Z0-9_]+$/
		return regex.test(input);
	}

	if (!Object.values(EDifficulty).includes(queueing.difficulty))
		return false
	if (!Object.values(EMatchingType).includes(queueing.matchingType))
		return false
	if (queueing.matchingType === EMatchingType.INVITE)
	{
		if (!inviteUsername || inviteUsername === '' || inviteUsername.length < 3)
			return false
		if (!isValidInput(inviteUsername))
			return false
	}

	return true
}

const CheckButton = ({_key, text, color, selected, clickHandler}:
		{
			_key: EMatchingType | EDifficulty,
			clickHandler:  ADifficultyHandle | AMatchingHandle,
			text: string,
			color: string,
			selected: string
		}
	) => (
	<button className={`font-pixelify border-solid border-[.2rem] py-1 w-56 sm:w-64 rounded-full
		${selected === _key ? `bg-${color} text-background border-textColor` : `border-${color} text-${color} bg-background`}
		hover:text-background hover:border-${color} hover:bg-${color} shadow-buttonShadow capitalize`}
		
		onClick={() => {
			(clickHandler as (s: EMatchingType | EDifficulty) => any)(_key);
		  }}
		>
		{text}
	</button>
)

const ConfigElems = () => {
	const [difficulty, setDifficulty] = useContext(DifficultyContext)
	const startButtonRef = useRef<HTMLButtonElement>(null);
	const searchForFriendRef = useRef<HTMLInputElement>(null);
	const [matchingType, setMatchingType] = useState(EMatchingType.RANDOM)

	const difficultyHandeler = (s: EDifficulty) => setDifficulty(s)

	const matchingTypeHandeler = (s: EMatchingType) => setMatchingType(s)
	const socketCtx = useContext(SocketContext)

	useEffect(() => {
		const queueingParams: IQueue = {
			difficulty: EDifficulty.EASY,
			matchingType: EMatchingType.RANDOM
		}
		if (!startButtonRef || !searchForFriendRef)
			return
		const start = startButtonRef.current as HTMLButtonElement
		const search = searchForFriendRef.current as HTMLInputElement
		
		start.addEventListener('click', () => {
			let res: boolean
			if (search)
				res = queueingQuery(queueingParams, search.value)
			else
				res = queueingQuery(queueingParams)
			if (res)
			{
				socketCtx.emit('queueing', queueingParams)

			}



		})
	}, [difficulty, matchingType])

	return (
		<div className={`flex flex-col lg:gap-8 md:gap-5 sm:gap-2 gap-8 border z-0 text-sm md:text-base lg:text-lg`}>
			<div className={`flex  flex-col gap-2 items-center justify-evenly`}>
				<CheckButton clickHandler={difficultyHandeler} text="easy" color="sucessColor" _key={EDifficulty.EASY} selected={difficulty} />
				<CheckButton clickHandler={difficultyHandeler} text="medium" color="secondary" _key={EDifficulty.MEDIUM} selected={difficulty} />
				<CheckButton clickHandler={difficultyHandeler} text="hard" color="errorColor" _key={EDifficulty.HARD} selected={difficulty} />
			</div>
			<div className={`flex flex-col gap-2 items-center justify-evenly`}>
				<CheckButton clickHandler={matchingTypeHandeler} text="Random" color="primary" _key={EMatchingType.RANDOM} selected={matchingType} />
				<CheckButton clickHandler={matchingTypeHandeler} text="With a friend" color="[#9A73A6]" _key={EMatchingType.INVITE} selected={matchingType} />
			</div>
			{matchingType === EMatchingType.INVITE ? (<input type="text" placeholder="Who..." ref={searchForFriendRef}
				className={`px-2 py-1 w-56 sm:w-64 border-solid border-textColor border-[.2rem] font-pixelify
				rounded-full focus:outline-none shadow-buttonShadow`} />) : null}
			<div className={`flex  flex-col gap-2 items-center justify-evenly`}>
				<button ref={startButtonRef} className={`py-1 border-solid border-textColor border-[.2rem] bg-buttonColor
				rounded-full focus:outline-none font-pixelify shadow-buttonShadow w-56 sm:w-64`}>
					Start
				</button>
			</div>
		</div>
	)
}

const AnimatedElement = () => {

	const container = useRef(null)
	const [difficulty, _] = useContext(DifficultyContext)


	
	useEffect(() => {
		
		if (container.current)
		{
			let speed = difficulty === EDifficulty.HARD ? 3 : difficulty === EDifficulty.MEDIUM ? 2 : 1
			
			Lottie.setSpeed(speed)
			Lottie.loadAnimation({
				container: container.current,
				renderer: 'svg',
				loop: true,
				autoplay: true,
				animationData: require('../../assets/pongLottie.json'),
			})
		}
	}, [difficulty])
	return (
		<div className={`container overflow-hidden w-full h-full`}  ref={container}></div>
	)
}

const GameSetup = () => {

	
	const [difficulty, setDifficulty] = useState(EDifficulty.EASY)
		
	return (
		<DifficultyContext.Provider value={[difficulty, setDifficulty]}>
			<div id="game-setup-frame" className={`h-full w-full justify-center items-center z-0 flex flex-row`}>
				<div className={`flex w-1/2 h-full items-center justify-center`}>
					<ConfigElems />
				</div>
				<div className={`w-1/3 h-full items-center justify-center hidden lg:block`}>
					<AnimatedElement />
				</div>
			</div>
		</DifficultyContext.Provider>
	)
}

export default GameSetup