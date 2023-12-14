import { useContext, useState } from "react";
import { member, room } from "../../types/room";
import Profile from "../../assets/profile.png";
import { toast } from "react-toastify";
import { currentUser } from "../Context/AuthContext";

const filter = (str: string) => {
	if (str === "participation") return "participant";
	return str;
};
const Action = (userid: number, roomid: number, action: boolean, endpoint: string , refresh: any) => {
	const how: string = action ? "POST" : "PATCH";
	console.log(how);
	const data = fetch(`http://localhost:3001/chat/${endpoint}?room=${roomid}&target=${userid}`, { method: how })
		.then((data) => data.json())
		.then((data) => {
			let res = data.statusCode;
			if (typeof res  === "undefined")
			{
				refresh(data, null)
				toast(`action ${endpoint} succes`);
			}
			else toast.error(data.message);
		})
		.catch(() => toast.error(`network error`));
};

const byby = (userid: number, roomid: number, action: boolean, endpoint: string, refresh: any) => {
	const how: string = action ? "PATCH" : "DELETE";
	const data = fetch(`http://localhost:3001/chat/${endpoint}?room=${roomid}&target=${userid}`, { method: how })
		.then((data) => data.json())
		.then((data) => {
			let res = data.statusCode;
			if ( res === undefined) {
				
				refresh(data, null)
				toast(`action ${endpoint} succes`);
			}
			else toast.error(data.message);
		})
		.catch(() => toast.error(`network error`));
};

const deleteRoom = (roomid: number, refresh: any) => {
	const how: string = "DELETE";
	console.log(how);
	const data = fetch(`http://localhost:3001/chat/creation?room=${roomid}`, { method: how })
		.then((data) => data.json())
		.then((data) => {
			let res = data.statusCode;
			console.log(res);
			if (res < 400) {
				
				refresh(null, data)
				toast(`action delete succes`);
			}
			else toast.error(data.message);
		})
		.catch(() => toast.error(`network error`));
};

/**
 *
 * @param param0
 */
const MuteButton = ({ room, roomuser,refresh }: { room: number; roomuser: member ,refresh:any}) =>
	roomuser.ismuted ? (
		<button
			onClick={() => {
				Action(roomuser.user_id.id, room, false, "mute",refresh);
			}}
		>
			unmute
		</button>
	) : (
		<button
			onClick={() => {
				Action(roomuser.user_id.id, room, true, "mute",refresh);
			}}
		>
			mute
		</button>
	);
const DeleteRoom = ({refresh , room }: { refresh: any, room: number }) => <button onClick={() => deleteRoom(room,refresh)}>delete room</button>;
const KickButton = ({refresh , room, roomuser }: {refresh: any, room: number; roomuser: member }) => (
	<button onClick={() => Action(roomuser.user_id.id, room, true, "kick",refresh)}>kick</button>
);
const AdminButton = ({refresh , room, roomuser }: {refresh: any, room: number; roomuser: member }) =>
	roomuser.permission === "admin" ? (
		<button onClick={() => Action(roomuser.user_id.id, room, false, "diwana" ,refresh)}>revoke admin right</button>
	) : (
		<button onClick={() => Action(roomuser.user_id.id, room, true, "diwana" ,refresh)}>make admin</button>
	);

const BanButton = ({refresh,  room, roomuser }: {refresh: any, room: number; roomuser: member }) =>
	roomuser.isBanned ? (
		<button onClick={() => Action(roomuser.user_id.id, room, false, "ban",refresh)}>unban</button>
	) : (
		<button onClick={() => Action(roomuser.user_id.id, room, true, "ban",refresh)}> ban</button>
	);

const OwnershipButton = ({ refresh, room, roomuser }: { refresh: any, room: number; roomuser: member }) => (
	<button onClick={() => byby(roomuser.user_id.id, room, true, "lwert",refresh)}>give owner</button>
);

const LeaveButton = ({ refresh ,room, roomuser }: {refresh: any, room: number; roomuser: member }) => (
	<button onClick={() => byby(roomuser.user_id.id, room, false, "humans",refresh)}>leave room</button>
);
/**
 *
 * @param param0
 */
const RoomsettingItem = ({
	refresh,
	user,
	roomid,
	userPerm,
}: {
	refresh: any;
	user: member;
	roomid: number;
	userPerm: member | null;
}) => {
	const [expand, setExpand] = useState(false);
	var more;
	if (expand && userPerm?.permission === "participation")
		more = (
			<div className="flex flex-col">
				{userPerm.user_id.id === user.user_id.id ? <LeaveButton refresh={refresh} room={roomid} roomuser={user} /> : <></>}
			</div>
		);
	console.log(userPerm, user);
	if (expand && userPerm?.permission === "owner") {
		more = (
			<div className="flex flex-col">
				{user.permission === "participation" ? (
					<>
						<KickButton refresh={refresh} room={roomid} roomuser={user} />
						<BanButton refresh={refresh} room={roomid} roomuser={user} />
						<MuteButton refresh={refresh} room={roomid} roomuser={user} />
						<AdminButton refresh={refresh} room={roomid} roomuser={user} />
						<OwnershipButton refresh={refresh} room={roomid} roomuser={user} />
					</>
				) : user.permission === "admin" ? (
					<>
						<AdminButton refresh={refresh} room={roomid} roomuser={user} />
						<OwnershipButton refresh={refresh} room={roomid} roomuser={user} />
					</>
				) : (
					<DeleteRoom refresh={refresh} room={roomid} />
				)}
			</div>
		);
	}
	if (expand && userPerm?.permission === "admin")
		more = (
			<div className="flex flex-col">
				{user.permission === "participation" ? (
					<>
						<KickButton refresh={refresh} room={roomid} roomuser={user} />
						<BanButton refresh={refresh} room={roomid} roomuser={user} />
						<MuteButton refresh={refresh} room={roomid} roomuser={user} />
					</>
				) : user.permission === "admin" && user.user_id.id === userPerm.user_id.id ? (
					<>
						<AdminButton refresh={refresh} room={roomid} roomuser={user} />
					</>
				) : (
					<></>
				)}
			</div>
		);

	return (
		<div>
			<div className="flex flex-row border-solid border-2 gap-2">
				<div className="max-h-[75px] max-w-[75px]">
					<img src={Profile}></img>
				</div>
				<div>
					<p>{user.user_id.nickname}</p>
				</div>
				<div>
					<p>{filter(user.permission)}</p>
				</div>
				<div>
					<button onClick={() => setExpand(!expand)}>{expand ? "less" : "more"} </button>
				</div>
			</div>
			{more}
		</div>
	);
};
const ChangeRoomType = ({ room }: { room: room | null }) => {
	const [clicked, click] = useState(false);
	const [type, setType] = useState("public");
	const [password, setPassword] = useState("");
	const [name, setName] = useState<string | null>(room ? room.name : "");
	if (type !== "protected" && password.length) setPassword("");
	if (!clicked) return <button onClick={() => click(true)}>Modify Room</button>;
	const createRoom = (e: any) => {
		e.preventDefault();
		const roomform = {
			password: password,
			name: name,
			type: type,
		};
		const data = fetch(`http://localhost:3001/chat/modify?room=${room}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(roomform),
		})
			.then((data) => data.json())
			.then((data) => {
				let res = data.statusCode;
				console.log(data);
				if (res < 400) toast(data.message);
				if (res >= 400 && Array.isArray(data.message)) data.message.map((e: string) => toast.error(e));
				else if (res >= 400) toast.error(data.message);
			})
			.catch((e) => toast.error(e.message));
		setPassword("");
		setName("");
		setType("public");
		click(false);
	};
	return (
		<form className="flex flex-col">
			<div className="flex flex-row">
				<div className="flex flex-row">
					<p>name</p>
					<input
						value={name ? name : ""}
						onChange={(e) => setName(e.target.value)}
						placeholder="type a name"
						type="text"
					></input>
				</div>
				<p>RoomType</p>
				<select onChange={(e) => setType(e.target.value)}>
					<option value="public">public</option>
					<option value="protected">protected</option>
					<option value="private">private</option>
				</select>
			</div>
			{type === "protected" ? (
				<div className="flex flex-row">
					<p>Password</p>
					<input onChange={(e) => setPassword(e.target.value)} placeholder="***" type="password"></input>
				</div>
			) : (
				<></>
			)}
			<button onClick={createRoom}> modify </button>
			<button onClick={() => click(false)}>dismiss</button>
		</form>
	);
};
const RoomSettings = ({ refresh, returnbutton, room }: { refresh: any; returnbutton: any; room: room | null }) => {
	const [userState, setUserState] = useState<member | null>(null);
	const [query, setQuery] = useState("");
	const user = useContext(currentUser);
	var list;
	if (room) {
		list = room.rooms_members.map((ob: member, index: number) => {
			let nickname = ob.user_id.nickname.toLowerCase();
			if (user?.id === ob.user_id.id && !userState) {
				setUserState(ob);
				console.log(ob.permission);
			}
			if (nickname.includes(query.toLowerCase()))
				return <RoomsettingItem refresh={refresh} user={ob} roomid={room.id} userPerm={userState} />;
		});
	}
	const setQueryonchange = (object: any) => {
		setQuery(object.target.value);
	};
	return (
		<div className="flex flex-col h-full">
			<div>
				<button onClick={() => returnbutton(false)}> rja3 lchat </button>
			</div>
			<div>{userState?.permission === "owner" ? <ChangeRoomType room={room} /> : <></>}</div>
			<div>
				<input type="text" value={query} onChange={setQueryonchange} placeholder="Finduser"></input>
			</div>
			<div className="flex flex-col overflow-y-scroll gap-2  ">{list}</div>
		</div>
	);
};
export default RoomSettings;

/**
 * if new admin ban and mute should be removed
 */
