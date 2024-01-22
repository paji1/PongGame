import { useContext } from "react";
import { ip } from "../../network/ipaddr";
import { INotificaion, InviteType, NotificationStatus } from "../../types/NotificationItem";
import IUser from "../../types/User";
import { currentUser } from "../Context/AuthContext";
import { SocketContext } from "../Context/SocketContext";
import { toast } from "react-toastify";

const AcceptFriend = async (id: number) =>
{
	await fetch(`http://${ip}3001/invite/friend/invite?id=${id}` , {credentials: 'include', method: "POST"}).catch(err => toast.error("Exeption: Network error"))
}

const RejectFriend = async (id:number) =>
{
	await fetch(`http://${ip}3001/invite/friend/invite?id=${id}` , { credentials: "include", method: "DELETE"}).catch(err => toast.error("Exeption: Network error"))
}


const acceptGameInvite = async (notif: INotificaion, socket: any) => {
	const e = {
		invite_id: notif.id,
		issuer_id: notif.issuer_id.id,
		receiver_id: notif.reciever_id.id,
		issuer_name: notif.issuer_id.user42,
		reciever_name: notif.reciever_id.user42,
		game_id: notif.game_id,
		game_mode: notif.game_mode
	}
	socket.emit("ACCEPT_GAME_INVITE", e)
}

const refuseGameInvite = async (notif: INotificaion, socket: any) => {
	const e = {
		id: notif.id,
		type: notif.type,
		issuer_id: notif.issuer_id.id,
		reciever_id:notif.reciever_id.id,
		game_id: notif.game_id,
		status: notif.status,
	}
	socket.emit("REJECT_GAME_INVITE", e)
}


const routeinvites = (what:string, notif:INotificaion,  socket: any) => 
{
	if (what == "ok")
	{
		if (notif.type ===  InviteType.Friend)
			AcceptFriend(notif.id)
		if (notif.type ===  InviteType.Game)
		{
			acceptGameInvite(notif, socket)
		}
		if (notif.type ===  InviteType.Room)
			socket.emit("ROOMACTION", {room:notif.room_id.id, target:notif.id, What: what})
	}
	if (what == "no")
	{
		if (notif.type ===  InviteType.Friend)
			RejectFriend(notif.id)
		if (notif.type ===  InviteType.Game)
		{
		
			refuseGameInvite(notif, socket)
		}
		/**
		 * 
		 */
		if (notif.type ===  InviteType.Room)
		socket.emit("ROOMACTION", {room:notif.room_id.id, target:notif.id, What: what})
	}

}
const NotificationItem = ({ notif }: { notif: INotificaion }) => {
	const user = useContext(currentUser)
	const socket = useContext(SocketContext)
	
	let FRIEND_REQUEST = "sent you a friend request";
	let CHAT_ROOM = "invited you to join the chat room:";
	let GAME_INVITE = "challenged you to a game";
	if (user && user.id == notif.issuer_id.id)
	{
		 FRIEND_REQUEST = ": requested  " + notif.reciever_id.nickname + "as a friend";
		 CHAT_ROOM = ": you invited " + notif.reciever_id.nickname + "to a chat room";
		 GAME_INVITE = ": you chalenged "+ notif.reciever_id.nickname + " to a game";
	}

	return (
		<div className={`border-solid border-2 border-textColor flex flex-row gap-3 p-1`}>
			<div
				className={`flex lg:mr-3 w-[102px] h-[102px] sm:w-[72px] sm:h-[72px]
			`}
			>
				
				<img src={ notif.issuer_id.avatar}></img>
			</div>
			<div className={`flex justify-between flex-auto flex-col sm:flex-row gap-2 `}>
				<div className="flex flex-col gap-1 justify-center">
					<h1 className={`text-lg text-primary `}> {!( notif.status === NotificationStatus.pending) ?  notif.status :notif.issuer_id.nickname }</h1>
					<p className="text-sm">
						{notif.type === InviteType.Friend
							? notif.issuer_id.nickname + " " + FRIEND_REQUEST
							: notif.type === InviteType.Game
							  ? notif.issuer_id.nickname + " " + GAME_INVITE + " "
							  : notif.type === InviteType.Room
							    ? notif.issuer_id.nickname + " " + CHAT_ROOM + " " + notif.room_id?.name
							    : ""}
				
					</p>
				</div>
				<div
					className={`grid grid-cols-2 gap-3 content-evenly p-2
					 `}
				>
					{
						(notif.status === NotificationStatus.pending && user?.id != notif.issuer_id.id) ? <> <button className="flex items-center justify-center col-1" onClick={() => routeinvites("ok",notif, socket) }>
						<svg
							className={`fill-sucessColor`}
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							>
							<path d="M20 4V6H18V8H16V10H14V12H12V14H10V16H9V17H7V16H6V14H4V13H2V16H4V18H6V20H7V21H9V20H10V18H12V16H14V14H16V12H18V10H20V8H22V4H20Z" />
						</svg>
					</button>
					<button className="flex items-center justify-center col-1" onClick={() => routeinvites("no",notif, socket)}>
						<svg
							className={`stroke-errorColor`}
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							>
							<path d="M18 6L6 18" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
							<path d="M6 6L18 18" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
						</svg>
					</button></> : null
				
					}
					
					<div>
					{
						user?.id == notif.issuer_id.id  ? <>outgoing</> : <>incoming</>
					}
					</div>
				</div>
			</div>
			</div>
	);
};

export default NotificationItem;
