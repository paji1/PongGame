const GameOver = ({isWinner}: {isWinner: boolean}) => {
	return (
		<div>
			{
				isWinner ? "winner" : "loser"
			}
		</div>
	)
}

export default GameOver