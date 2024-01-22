import { useContext, useState } from "react";
import { SocketContext } from "../Context/SocketContext";
import Sendsvg from "../../assets/send.svg"
import { toast } from "react-toastify";

export const MessageBar = ({ roomnumber }: { roomnumber: number }) => {
	const socket = useContext(SocketContext);

	const [textmessage, settextmessage] = useState<string>("");
	// const writing = () => {
	// 	/**
	// 	 * user is sending message!!!!!!!!
	// 	 */
	// };
	const setMessage = (object: any) => {
		settextmessage(object.target.value);
	};
	const sendSocket = (input: any) => {
		input.preventDefault();
		if (!socket.connected) {
			toast.error("socket not conected");
			return;
		}
		if (!textmessage.length) return;
		const messsage = {
			target: -1,
			room: roomnumber,
			What: textmessage,
		};
		socket.emit("CHAT", messsage);
		input.target.value = "";
		settextmessage(input.target.value);
	};
	const  submitOnEnter = (event :any) =>{
		
		if (event.which === 13)
		{
			event.preventDefault(); 
			event.target.value = ""
			settextmessage(event.target.value)
			sendSocket(event);
			return ;
		}
	}

	return (

		<form className="h-[60px] flex flex-row  justify-between ">
			<div className="h-full w-full  flex items-center justify-center  ">
				<textarea onKeyDown={(e) => submitOnEnter(e)} className=" max-h-[3rem] min-h-[3rem]  rounded-lg w-[95%] h-[80%] break-words text-black"  value={textmessage} onChange={setMessage} placeholder="send a new message"></textarea>
			</div>
			<div className=" h-full w-[20%]   flex items-center justify-center">
				<button className=" w-[80%] h-[80%]" onClick={sendSocket}>
					<img alt="send" className="h-full w-full rounded-lg border-solid border-white border-2" src={Sendsvg}></img>
				</button>
			</div>
		</form>
	);
};