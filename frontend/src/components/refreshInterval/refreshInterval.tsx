import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

const useRefreshinterval = () => {
	const [error, setError] = useState<string | null>(null);
	const intervalRef = useRef<NodeJS.Timer | undefined>();

	const getToken = useCallback(() => {
		axios
			.post("http://taha.redirectme.net:3001/auth/refresh", {}, { withCredentials: true })
			.then((res) => {})
			.catch((err): any => {
				// console.error("axios get refresh error:", err);
				setError("error : refresh token not found");
			});
	}, []);

	useEffect(() => {
		getToken();
		const interval = setInterval(() => getToken(), 14 * 60 * 1000);
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
