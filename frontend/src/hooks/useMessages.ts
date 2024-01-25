import { useEffect } from "react";
import { toast } from "react-toastify";
import { ip } from "../network/ipaddr";

const useMessages = (updater: boolean, setmessages: any) => {
	useEffect(() => {
		
		const data = fetch(`http://${ip}3001/chat/comunication`,
		{
			  credentials: 'include'
		})
			.then((data) => 
			{
				if (data.status < 400)
					return data.json()
				toast.error("failed to fetch messages")
			})
			.then((data) => 
			{
				if (Array.isArray(data))
					setmessages(data) 
			})
			.catch(() => toast.error(`messages: network error`))

	}, [updater]);
};
export default useMessages;
