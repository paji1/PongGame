import Footer from "../Footer";
import ProfileDiv from "./UserProfile/UserProfile";
import Carousel from "./PongAchievements/Carousel";
import Stats from "./PongStats/Stats";
import Ladder from "./Ladder/LeaderBoard";
import History from "./matchHistory/matchHistory";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { currentUser } from "../Context/AuthContext";
import { toast } from "react-toastify";
import { ip } from "../../network/ipaddr";
import IUser from "../../types/User";
import { Histo, achived } from "../../types/yearlyres";

const useGetTrophiesData = async (settrdata: any, nickname: string | undefined) => {
	useEffect(() => {
		fetch(`http://${ip}3001/profile/${nickname}/achieved`, {
			method: "GET",
			credentials: "include",
		})
			.then((data) => data.json())
			.then((data) => {
				settrdata(data);
				console.log(data, "dasdasdas");
			});
	}, []);
};

const useGetGamingData = async (setgdata: any, nickname: string | undefined) => {
	useEffect(() => {
		fetch(`http://${ip}3001/profile/${nickname}/GamingHistory`, {
			method: "GET",
			credentials: "include",
		})
			.then((data) => data.json())
			.then((data) => {
				setgdata(data);
			});
	}, []);
};

const useGetFLadderData = async (setfladder: any, nickname: string | undefined) => {
	useEffect(() => {
		fetch(`http://${ip}3001/profile/${nickname}/FLadder`, {
			method: "GET",
			credentials: "include",
		})
			.then((data) => data.json())
			.then((data) => {
				setfladder(data);
			});
	}, []);
};

const useGetLadderData = async (setgladder: any, nickname: string | undefined) => {
	useEffect(() => {
		fetch(`http://${ip}3001/profile/${nickname}/GLadder`, {
			method: "GET",
			credentials: "include",
		})
			.then((data) => data.json())
			.then((data) => {
				setgladder(data);
			});
	}, []);
};

const useGetUserdata = async (setdashstate: any, nickname: string | undefined) => {
	useEffect(() => {
		fetch(`http://${ip}3001/profile/user/${nickname}`, {
			method: "GET",
			credentials: "include",
		})
			.then((Response) => Response.json())
			.then((Response) => {
				if (Response.statusCode >= 400) {
					toast(`HTTP error! Status: ${Response.status}`);
					setdashstate(null);
				} else setdashstate(Response);
			});
	}, []);
};

export default function Dashboard() {
	const user = useContext(currentUser);
	const [dashstate, setdashstate] = useState<IUser | null>(null);
	const [gladder, setgladder] = useState<IUser[] | null>(null);
	const [fladder, setfladder] = useState<IUser[] | null>(null);
	const [gamesdata, setgdata] = useState<Histo[] | null>(null);
	const [trophydata, settrdata] = useState<number[] | null>(null);
	const params = useParams();

	const nickname = params.nickname ? params.nickname : user?.nickname;
	const who = user?.nickname === nickname;
	useGetUserdata(setdashstate, nickname);
	useGetLadderData(setgladder, nickname);
	useGetFLadderData(setfladder, nickname);
	useGetGamingData(setgdata, nickname);
	useGetTrophiesData(settrdata, nickname);
	if (dashstate === null || user == undefined || setfladder === null) return <>404</>;
	return (
		<div className="flex flex-col gap-y-16 mt-16">
			<ProfileDiv who={who} usr={dashstate} func={setdashstate} />
			<Carousel achivments={trophydata} />
			<Stats History={gamesdata} />
			{who ? <Ladder GLadder={gladder} FLadder={fladder} /> : null}
			<History History={gamesdata} />
			<Footer />
		</div>
	);
}
