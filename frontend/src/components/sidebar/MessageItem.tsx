import { Link } from "react-router-dom";
import { messages } from "../../types/messages";
import { CurrentUser } from "../Context/AuthContext";

export const Messageitem = ({ user, messages }: { user: CurrentUser; messages: messages }) => {
	return (
		<div className={`flex   ${user?.id === messages.senderid.id ? "flex-row-reverse" : "flex-row"}     justify-between `}
		>
			<div className="w-[15%] flex justify-center ">
				<Link to={`/profile/${messages.senderid.nickname}`}>
				<img  alt="avatar" className=" border-solid border-2 rounded-full h-[60px] w-[60px]" src={messages.senderid.avatar}></img>
				</Link>
			</div>
			<div className={`p-2 rounded-2xl border-solid  border-2 w-[80%] flex items-center ${user?.id === messages.senderid.id ? "justify-end bg-MeColor" : "justify-start bg-YouColor"}` }>
				<p className={`w-full  break-words  ${user?.id === messages.senderid.id ? "text-right" : ""}  `} >{messages.messages}</p>
			</div>
			<div className="w-[10px]"></div>
		</div>
	);
};
