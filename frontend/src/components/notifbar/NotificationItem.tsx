import { INotificaion, InviteType } from "../../types/NotificationItem"


const NotificationItem = ({notif}: {notif: INotificaion}) => {

	const FRIEND_REQUEST = "sent you a friend request"
	const CHAT_ROOM = "invited you to join the chat room:"
	const GAME_INVITE = "challenged you to a game"

	return (
		<div className={`border-solid border-2 border-textColor flex flex-row gap-3 p-1`}>
			<div className={`flex lg:mr-3 w-[102px] h-[102px] sm:w-[72px] sm:h-[72px]
			`}>
				<img src={notif.initiator.avatar} alt={notif.initiator.nickname} className={`
					border-2 border-solid border-textColor 
					
				`} />
			</div>
			<div className={`flex justify-between flex-auto flex-col sm:flex-row gap-2 `}>
				<div className="flex flex-col gap-1 justify-center">
					<h1 className={`text-lg text-primary `}>
						{notif.initiator.user42}
					</h1>
					<p className="text-sm">
						{
							(notif.inviteType === InviteType.FRIEND) ? 
								notif.initiator.nickname + ' ' + FRIEND_REQUEST :
							(notif.inviteType === InviteType.GAME) ? 
								notif.initiator.nickname + ' ' + GAME_INVITE :
							(notif.inviteType === InviteType.ROOM) ?
								notif.initiator.nickname + ' ' + CHAT_ROOM : ""
						}
					</p>
				</div>
				<div className={`grid grid-cols-2 gap-3 content-evenly p-2
					 `}>
					<button className="flex items-center justify-center col-1">
						<svg className={`fill-sucessColor`}
							width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M20 4V6H18V8H16V10H14V12H12V14H10V16H9V17H7V16H6V14H4V13H2V16H4V18H6V20H7V21H9V20H10V18H12V16H14V14H16V12H18V10H20V8H22V4H20Z"/>
						</svg>
					</button>
					<button className="flex items-center justify-center col-1">
						<svg className={`stroke-errorColor`}
							width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18 6L6 18"  strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"/>
							<path d="M6 6L18 18"  strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	)

}

export default NotificationItem