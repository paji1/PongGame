import { useEffect } from "react";
import { toast } from "react-toastify";
import { ip } from "../network/ipaddr";

export default function useRooms(rerender: boolean, setRooms: any) {
	useEffect(() => {
		fetch("http://" + ip + "3001/chat/town",
		{
			credentials: 'include'
	  })
			.then((data) => 
			{
				if (data.status < 400)
					return data.json()
				toast.error("Failed to fetch rooms")
			})
			.then((data) => {
				if (Array.isArray(data))
					setRooms(data)
			})
			.catch(() => toast.error(`Rooms: network error`))
	}, [rerender]);
}

