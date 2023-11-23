import { useEffect } from "react";

const useMessages = (room: number, setmessages: any) => {
	useEffect(() => {
		if (room === -1)
			return ;
		const data = fetch(`http://localhost:3001/chat/comunication?room=${room}`)
			.then((data) => data.json())
			.then((data) => setmessages(data))
			.catch((e) => console.log(e));
	}, []);
};
export default useMessages;
