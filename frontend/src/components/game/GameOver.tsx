import { useContext, useEffect } from "react"
import { GameContext } from "../Context/GameContext"

const STYLE_CLASSES = `w-full h-full flex flex-col justify-center items-center capitalize font-pixelify`

const Win = () => {
	return (
		<div className={`${STYLE_CLASSES} `}>
		<p className={`sm:text-5xl text-2xl`}>Game Over</p>
			<p>dinner dinner, chicken winner.</p>
			<audio src="https://www.myinstants.com/media/sounds/golf-clap-xd.mp3" typeof="audio/mpeg" autoPlay={true} loop={false}></audio>
		</div>
	)
}

const Lose = () => {
	return (
		<div className={`${STYLE_CLASSES}`}>
			<p className={`sm:text-5xl text-2xl`}>Game Over</p>
			<p>you suck</p>
			<audio src="https://www.myinstants.com/media/sounds/sadtrombone.swf.mp3" typeof="audio/mpeg" autoPlay={true} loop={false}></audio>
		</div>
	)
}

const GameOver = ({isWinner}: {isWinner: boolean}) => {

	const [, setGameContext] = useContext(GameContext)

	useEffect(() => {
		setGameContext(null)
	}, [])

	return (
		<div className={`w-full h-full text-background`}>
			{
				isWinner ? <Win /> : <Lose />
			}
		</div>
	)
}

export default GameOver