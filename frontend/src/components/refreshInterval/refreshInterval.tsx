import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import HandleError from "../../types/error";

const useRefreshinterval = () => {
	const [error, setError] = useState<string | null>(null);
	const intervalRef = useRef<NodeJS.Timer | undefined>();

	const getToken = useCallback(() => {
		console.log("refresh")
		axios
			.post("http://taha.redirectme.net:3001/auth/refresh", {}, { withCredentials: true })
			.then((res: Response | any) => {
				if (!res.ok) return Promise.reject(res);
			})
			.catch((res): any => {
				HandleError(res);
				// console.error("axios get refresh error:", err);
			});
	}, []);

	useEffect(() => {
		getToken();
		const interval = setInterval(() => getToken(), 13 * 60 * 1000);
		intervalRef.current = interval;

		return () => clearInterval(interval);
	}, [getToken]);

	useEffect(() => {
		if (error) {
			// toast.error(error);
			setError(null);
		}
	}, [error]);
};

export default useRefreshinterval;
