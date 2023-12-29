import { useEffect } from "react";
import { toast } from "react-toastify";
import { ip } from "../network/ipaddr";

const useMessages = (updater: boolean, setmessages: any) => {
	useEffect(() => {
		
		const data = fetch(`http://${ip}3001/chat/comunication`,
		{
			  credentials: 'include'
		})
			.then((data) => data.json())
			.then((data) => 
			{
				if (!Array.isArray(data))
					toast.error(data.message)
				setmessages(data) 
			})
			.catch(() => toast.error(`messages: network error`))

	}, [updater]);
};
export default useMessages;
