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
			.then((data) => 
			{
				if (data.status < 4000)
					return data.json()
				toast.error("Error getting achievements")
			})
			.then((data) => {
				if (Array.isArray(data))
				settrdata(data);

			}).catch((err => {}));
	}, [nickname]);
};

const useGetGamingData = async (setgdata: any, user: IUser | null , id: number) => {

	useEffect(() => {
		fetch(`http://${ip}3001/profile/${(user) ? user.id : id}/GamingHistory`, {
			method: "GET",
			credentials: "include",
		})
			.then((data) => 
			{
				if (data.status < 400)
					return data.json()
				toast.error("Error getting GamingHistory")
			})
			.then((data) => {
				if (Array.isArray(data))
					setgdata(data);
					console.log("nickname", user.id)
					console.log("data",data)
			}).catch((err => {}));
	}, [user]);
};

const useGetFLadderData = async (setfladder: any, nickname: string | undefined) => {
	useEffect(() => {
		fetch(`http://${ip}3001/profile/${nickname}/FLadder`, {
			method: "GET",
			credentials: "include",
		})
			.then((data) => {
				if (data.status < 400)
					return data.json()
				toast.error("Error getting Friends Ladder")
			})
			.then((data) => {
				if (Array.isArray(data))
					setfladder(data);
			}).catch((err => {}));
	}, [nickname]);
};

const useGetLadderData = async (setgladder: any, nickname: string | undefined) => {
	useEffect(() => {
		fetch(`http://${ip}3001/profile/${nickname}/GLadder`, {
			method: "GET",
			credentials: "include",
		})
		.then((data) => {
			if (data.status < 400)
				return data.json()
			toast.error("Error getting Global Ladder")
		})
			.then((data) => {
				if (Array.isArray(data))
					setgladder(data);
			}).catch((err => {}));
	}, [nickname]);
};

const useGetUserdata = async (setdashstate: any, nickname: string | undefined) => {
	useEffect(() => {
		fetch(`http://${ip}3001/profile/user/${nickname}`, {
			method: "GET",
			credentials: "include",
		})
			.then((data) => {
			if (data.status < 400)
				return data.json()
			toast.error("Error getting Global Ladder")
			return null
		})
			.then((Response) => {
				if (Response && Response.statusCode >= 400) {
					toast(`HTTP error! Status: ${Response.status}`);
					setdashstate(null);
				} else setdashstate(Response);
		
			});
	}, [nickname]);
};

export default function Dashboard({status} : {status: Map<string, string>}) {
	const user = useContext(currentUser);
	const [dashstate, setdashstate] = useState<IUser | null>(null);
	const [gladder, setgladder] = useState<IUser[] | null>(null);
	const [fladder, setfladder] = useState<IUser[] | null>(null);
	const [gamesdata, setgdata] = useState<Histo[] | null>(null);
	const [trophydata, settrdata] = useState<number[] | null>(null);
	const params = useParams();
	const nickname = params.nickname ? params.nickname : user?.nickname
	const who = user?.nickname === nickname;

		useGetUserdata(setdashstate, nickname);
		useGetLadderData(setgladder, nickname);
		useGetFLadderData(setfladder, nickname);
		useGetGamingData(setgdata, dashstate, user.id);
		useGetTrophiesData(settrdata, nickname);
	console.log("gamedata",gamesdata)
	if (dashstate === null || user == undefined || setfladder === null) return null;
	return (
		<div className="flex flex-col gap-y-16 mt-16">
			<ProfileDiv status={status} who={who} usr={dashstate} func={setdashstate} />
			<Carousel achivments={trophydata} />
			<Stats History={gamesdata} useer={dashstate} />
			{who ? <Ladder GLadder={gladder} FLadder={fladder} /> : null}
			<History History={gamesdata} />
			<Footer />
		</div>
	);
}
