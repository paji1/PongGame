import { useEffect } from "react";

export default function useRooms(rerender: boolean, setRooms: any) {
	useEffect(() => {
		const data = fetch("http://localhost:3001/chat/town")
			.then((data) => data.json())
			.then((data) => setRooms(data))
			.catch((e) => console.log(e));
		console.log("matrendrach");
	}, [rerender]);
}
