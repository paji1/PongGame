import { useContext, useEffect, useRef, useState } from "react"
import { EDifficulty, EMatchingType, IQueue, ADifficultyHandle, AMatchingHandle, DifficultyContext } from "../Context/QueueingContext"
import Lottie from "lottie-web"
import { SocketContext } from "../Context/SocketContext"
import { Socket } from "socket.io-client"
import { toast } from "react-toastify"


const matchingHandler = (difficulty: EDifficulty, matchingType: EMatchingType, searchBar: HTMLInputElement | null, socketCtx: Socket) => {
	const queue: IQueue = {
		difficulty: difficulty,
		matchingType: matchingType,
		invite: ''
	}
	if (matchingType === EMatchingType.INVITE && searchBar)
		queue.invite = searchBar.value
	socketCtx.emit('matching', queue)
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
	const [matchingType, setMatchingType] = useState(EMatchingType.RANDOM)
	const [searchBar, setSearchBar] = useState<HTMLInputElement | null>(null)
	const startButtonRef = useRef<HTMLButtonElement>(null);
	const searchForFriendRef = useRef<HTMLInputElement>(null);

	const difficultyHandeler = (s: EDifficulty) => setDifficulty(s)
	const matchingTypeHandeler = (s: EMatchingType) => setMatchingType(s)

	const socketCtx = useContext(SocketContext)

	useEffect(() => {
		if (matchingType === EMatchingType.INVITE)
			setSearchBar(searchForFriendRef.current)
		else
			setSearchBar(null)
	}, [matchingType])

	useEffect(() => {
		socketCtx.on('game_error', (messgae: string): any  => {
			toast.error(messgae)
		})

		socketCtx.on('invite_sent', (messgae: string) => {
			toast.success(messgae)
		})
		
		return (
			() => {
				socketCtx.off('game_error')
				socketCtx.off('enter_queue')
				socketCtx.off('invite_sent')
			}
		)
	}, [])

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
				rounded-full focus:outline-none shadow-buttonShadow focus:border-textColor focus:text-textColor`} required />) : null}
			<div className={`flex  flex-col gap-2 items-center justify-evenly`}>
				<button ref={startButtonRef} className={`py-1 border-solid border-textColor border-[.2rem] bg-buttonColor
				rounded-full focus:outline-none font-pixelify shadow-buttonShadow w-56 sm:w-64`}
				onClick={() => matchingHandler(difficulty, matchingType, searchBar, socketCtx)}>
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