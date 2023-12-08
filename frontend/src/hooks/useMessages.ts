import { useEffect } from "react";
import { toast } from "react-toastify";

const useMessages = (updater: boolean, setmessages: any) => {
	useEffect(() => {
		
		const data = fetch(`http://localhost:3001/chat/comunication`)
			.then((data) => data.json())
			.then((data) => 
			{
				if (!Array.isArray(data))
					toast.error(data.message)
				console.log("fetched messages")
				setmessages(data) 
			})
			.catch(() => toast.error(`messages: network error`))

	}, [updater]);
};
export default useMessages;
