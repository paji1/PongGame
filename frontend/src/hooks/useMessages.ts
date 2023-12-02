import { useEffect } from "react";
import { toast } from "react-toastify";

const useMessages = (room: number, setmessages: any) => {
	useEffect(() => {
		if (room === -1)
			return ;
		const data = fetch(`http://localhost:3001/chat/comunication?room=${room}`)
			.then((data) => data.json())
			.then((data) => 
			{
				if (!Array.isArray(data))
					toast.error(data.message)
				setmessages(data) 
			})
			.catch(() => toast.error(`messages: network error`))

	}, []);
};
export default useMessages;
