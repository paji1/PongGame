import { useEffect } from "react";
import { toast } from "react-toastify";
import { ip } from "../network/ipaddr";

export default function useRooms(rerender: boolean, setRooms: any) {
	useEffect(() => {
		const data = fetch("http://" + ip + "3001/chat/town",
		{
			credentials: 'include'
	  })
			.then((data) => data.json())
			.then((data) => {
				if (!Array.isArray(data))
					toast.error(data.message)
				console.log(data)
				setRooms(data)
			}
			)
			.catch(() => toast.error(`Rooms: network error`))
	}, [rerender]);
}

