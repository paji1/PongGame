import  { useContext } from "react";
import { room } from "../../types/room";
import { messages } from "../../types/messages";
import { currentUser } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import ONLINE from "../../assets/online.svg"
import OFFLINE from "../../assets/offline.svg"
import GAME from "../../assets/game.svg"
import BLOCKED from "../../assets/blockicon.svg"
import SAD from "../../assets/sad.svg"

const filterStatus= (str:string) => 
{
	switch (str)
	{
		case "ONLINE":
				return ONLINE
		case "OFFLINE":
				return OFFLINE;
		case "IN_GAME":
				return GAME;
		case "BLOCKED":
			return BLOCKED;
		default:
				return SAD;
	}
}

const FriendItem = ({ status, selector, room, glimpse }: {status: Map<string, string>,  selector: any; room: room; glimpse: messages[] }) => {
	let preview;
	const user = useContext(currentUser);
	const friend = room.rooms_members.filter((ob) => ob.user_id.id !== user?.id);
	if (Array.isArray(glimpse) && glimpse.length === 1)
		preview = glimpse[0].messages.length > 25 ? glimpse[0].messages.substring(0, 25) : glimpse[0].messages;
	const name = friend[0].user_id.nickname;
	const display = name.length > 15 ? name.substring(0, 15) : name;
	const ping = status.get(friend[0].user_id.user42)
	const activity = ping ? ping : "NotFriends"
	return (
		<div className={` ${!ping || ping ==="BLOCKED" ? "grayscale" : "" } flex flex-row mx-2 gap-3 p-2 shadow-buttonShadow rounded border-solid border-textColor border-2`}>
			<div className=" w-1/6 justify-center rounded">
				<img alt="avatar" className="shadow-buttonShadow max-h-[75px] max-w-[75px]" src={friend[0].user_id.avatar}></img>
			</div>
			<div onClick={selector} className="flex flex-col flex-auto cursor-pointer gap-2 ">
				<p className=" text-center  text-ellipsis overflow-hidden text-primary text-xl">{display}</p>
				<p className="text-ellipsis overflow-hidden ">{preview}</p>
			</div>
			<div className="flex items-center justify-center w-1/6 ">
				<img title={activity} className={` ${ping ? " w-[20px] h-[20px]" : "w-[40px] h-[40px] border-2 border-solid rounded-full"} `} alt={activity} src={filterStatus(activity)}></img>
			</div>
			<div className="flex items-center justify-center w-1/6 ">
				<Link to={`/profile/${name}`}>
					<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M4 9H5V10H11V9H12V8H13V2H12V1H11V0H5V1H4V2H3V8H4V9ZM5 4H6V3H7V2H9V3H10V4H11V6H10V7H9V8H7V7H6V6H5V4Z"
							fill="black"
						/>
						<path
							d="M14 12H13V11H2V12H1V13H0V18H2V15H3V14H4V13H11V14H12V15H13V18H15V13H14V12Z"
							fill="black"
						/>
						<path d="M16 9H17V8H18V2H17V1H16V0H15H14V3H15V4H16V5V6H15V7H14V10H16V9Z" fill="black" />
						<path d="M19 13V12H18V11H16V14H17V15H18V18H20V13H19Z" fill="black" />
					</svg>
				</Link>
			</div>
			<div className="flex items-center justify-center w-1/7 ">

				<svg onClick={() =>  } width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="13" y="14" width="2" height="2" rx="1" fill="#000301" />
					<rect x="7" y="11" width="2" height="6" rx="1" fill="#000301" />
					<rect x="11" y="13" width="2" height="6" rx="1" transform="rotate(90 11 13)" fill="#000301" />
					<rect x="16" y="12" width="2" height="2" rx="1" fill="#000301" />
					<path
						d="M14 8V8C14 7.58326 14 7.37488 13.9655 7.19144C13.8455 6.5546 13.4245 6.01534 12.8358 5.74455C12.6662 5.66654 12.464 5.616 12.0597 5.51493L12 5.5C11.5388 5.3847 11.3082 5.32706 11.1171 5.233C10.5686 4.96315 10.1737 4.45731 10.0449 3.85979C10 3.65151 10 3.41382 10 2.93845V2"
						stroke="#000301"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<path
						d="M3 14C3 11.4412 3 10.1618 3.61994 9.28042C3.77954 9.05351 3.96572 8.85041 4.17372 8.6763C4.98164 8 6.15442 8 8.5 8H15.5C17.8456 8 19.0184 8 19.8263 8.6763C20.0343 8.85041 20.2205 9.05351 20.3801 9.28042C21 10.1618 21 11.4412 21 14C21 16.5588 21 17.8382 20.3801 18.7196C20.2205 18.9465 20.0343 19.1496 19.8263 19.3237C19.0184 20 17.8456 20 15.5 20H8.5C6.15442 20 4.98164 20 4.17372 19.3237C3.96572 19.1496 3.77954 18.9465 3.61994 18.7196C3 17.8382 3 16.5588 3 14Z"
						stroke="#000301"
						strokeWidth="2"
					/>
				</svg>
			</div>
		</div>
	);
};
export default FriendItem;
