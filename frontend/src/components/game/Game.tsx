import { useContext, useEffect } from "react"
import { DifficultyContext } from "../Context/QueueingContext"
/**
 * - Server receives:
  * screen width
  * height width
  * socket id
  * y-axis of the paddle
  * difficulty

- Client receives
  * x, y-axis of the ball
  * y-axis of the opponent paddle
  * current match score
 */
const PlayGround = () => {

	const [difficulty, setDifficulty] = useContext(DifficultyContext)

	useEffect(() => {

	}, [])
	
	return (
		<div>
			Game started...
		</div>
	)

}

export default PlayGround