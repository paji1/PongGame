import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ip } from "../network/ipaddr";
import { room } from "../types/room";
import IUser from "../types/User";
import { Socket } from "socket.io-client";
import { SocketContext } from "../components/Context/SocketContext";

const RoomItem = ({ room, socket }: { room: room; socket: Socket }) => {
	const [password, setPassword] = useState("");
	const joinroom = () => {
		socket.emit("JOIN", { room: room.id, name: room.name, type: room.roomtypeof, password: password });
	};
	return (
		<div className=" flex-col sm:flex-row gap-y-6 gap-x-4 sm:gap-y-0 sm:items-center justify-between flex  m-auto ring-black shadow-buttonShadow ring-2 p-4 w-full truncate" >
			<div className="flex w-[45%] justify-between  gap-x-8 sm:gap-x-4 items-center">
					<img alt="name" className="w-[6rem] h-[6rem] shadow-buttonShadow" src={`https://fakeimg.pl/600x600?text=${"@ " +room.name.substring(0, 5)}`}></img>
					<div className="flex flex-col">
						<p>{room.name}</p>
						<p className="italic">{room.roomtypeof}</p>
						<p>{new Date(room.created_at).toDateString()}</p>
					</div>
			</div>
			{room.roomtypeof === "protected" ? (
				<input
				className="shadow-buttonShadow border-solid border-2 p-1 sm:w-auto w-[35%]"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="password"
				/>
			) : (
				<></>
			)}

			<button className="border border-solid p-2 shadow-buttonShadow w-[35%] sm:w-[15%]" onClick={joinroom} > join </button>
		</div>
	);
};
const UserItem = ({ user }: { user: IUser }) => {
	// const addFR = () => {
	// 	fetch(`http://${ip}3001/invite/friend?friend=${user.id}`, {
	// 		method: "POST",
	// 		credentials: "include",
	// 	})
	// 		.then((data) => data.json())
	// 		.then((data) => {
	// 			console.log(data);
	// 		})
	// 		.catch(() => toast.error(`search: network error`));
	// };
	return (
		<div className="flex-col sm:flex-row gap-y-6 gap-x-4 sm:gap-y-0 sm:items-center justify-between flex  m-auto ring-black shadow-buttonShadow ring-2 p-4 w-full truncate">
			<div className="flex w-[45%] justify-between  gap-x-8 sm:gap-x-4 items-center">
					<img alt="avatar" className="w-[6rem] h-[6rem] shadow-buttonShadow" src={user.avatar}></img>
					<div className="flex flex-col">
						<p>{user.nickname}</p>

						<p>{new Date(user.created_at).toDateString()}</p>
					</div>
			</div>
			<Link
			className=" text-center border border-solid p-2 shadow-buttonShadow w-[35%] sm:w-[15%]"
				to={`/profile/${user.nickname}`}
			>
				visit profile
			</Link>
		</div>
	);
};
export const SearchWindow = () => {
	const [params] = useSearchParams();
	const [rooms, roomstate] = useState<room[] | null>(null);
	const [users, usersstate] = useState<IUser[] | null>(null);
	const [userselector, usersetSelector] = useState(true);
	const [roomselector, roomsetSelector] = useState(true);

	const query = params.get("query");
	const socket = useContext(SocketContext);
	useEffect(() => {
		fetch(`http://${ip}3001/chat/search/${query}`, {
			credentials: "include",
		})
			.then((data) => data.json())
			.then((data) => {
				console.log(data);

				if (Array.isArray(data)) roomstate(data);
			})
			.catch(() => toast.error(`search: network error`));
		fetch(`http://${ip}3001/users/search/${query}`, {
			credentials: "include",
		})
			.then((data) => data.json())
			.then((data) => {
				console.log(data);
				if (Array.isArray(data)) usersstate(data);
			})
			.catch(() => toast.error(`search: network error`));
	}, [query]);

	return (
		<div className="h-[98vh] p-2 my-4 mx-auto  mt-8 max-w-[1536px] min-[0px]:mx-5 2xl:m-auto shadow-[2px_4px_0px0px#000301] font-Nova text-sm sm:text-base md:text-lg lg:text-xl">
			<div className="w-full flex flex-col sm:flex-row gap-2 gap-y-10 p-8 mt-2 m-auto justify-evenly items-center" >
			<div className=" sm:w-[20%] md:w-[25%] lg:w-[20%] border-solid border-2 p-2 shadow-buttonShadow font-extrabold text-center">Selected Filters</div>
				<div className="w-[55%] flex justify-around gap-x-6 md:gap-x-0">
				<button
					className={`${roomselector ? "bg-black text-white" : ""} border border-solid  w-[100px] p-2 shadow-buttonShadow`}
					onClick={() => roomsetSelector(!roomselector)}
					>
					{" "}
					rooms
				</button>
				<button
					className={`${userselector ? "bg-black text-white" : ""}  border border-solid  w-[100px] p-2 shadow-buttonShadow`}
					onClick={() => usersetSelector(!userselector)}
					>
					{" "}
					users
				</button>
					</div>
			</div>
			<div className="flex flex-col gap-y-10 p-8 mt-2 max-w-[1536px] m-auto">
				{rooms && roomselector  ? (rooms.map((ob: room) => <RoomItem socket={socket} room={ob} />)) : (null)}

				{users && userselector ? users.map((ob: IUser) => <UserItem user={ob} />) : null}
				{(!roomselector && !userselector && (rooms?.length || users?.length))? <h1 >Select a Filter</h1>: null }
				{!rooms?.length && !users?.length ? <h1>No result Found</h1> : null } 
				
			</div>
		</div>
	);
};
