const GameOver = ({isWinner}: {isWinner: boolean}) => {
	return (
		<div className={`text-white`}>
			{
				isWinner ? "winner" : "loser"
			}
		</div>
	)
}

export default GameOver