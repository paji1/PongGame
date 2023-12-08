import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useRooms(rerender: boolean, setRooms: any) {
	useEffect(() => {
		const data = fetch("http://localhost:3001/chat/town")
			.then((data) => data.json())
			.then((data) => {
				if (!Array.isArray(data))
					toast.error(data.message)
				console.log("fetched rooms")
				setRooms(data)
			}
			)
			.catch(() => toast.error(`Rooms: network error`))
	}, [rerender]);
}

