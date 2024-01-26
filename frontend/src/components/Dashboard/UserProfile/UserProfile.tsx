import AddPerson from "../../../assets/AddPerson.png";
import BlockPerson from "../../../assets/BlockPerson.png";
import Profil from "../../../assets/profile.png";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ip } from "../../../network/ipaddr";
import IUser from "../../../types/User";
import { UploadTest } from "../../UploadComponent";
import { SocketContext } from "../../Context/SocketContext";
import HandleError from "../../../types/error";

const useGetFrienshipsStatus = async (setisFriend: any, dashstate: IUser) => {
	try {
		useEffect(() => {
			fetch(`http://${ip}3001/profile/friendship/${dashstate?.id}`, {
				method: "GET",
				credentials: "include",
			})
				.then((Response) => {
					if (Response.status !== 200) {
						setisFriend(false);
					} else {
						setisFriend(true);
					}
				})
				.then((Response) => Response);
		}, [dashstate]);
	} catch (error) {
		console.error("Error fetching data:", error);
	}
};


export default function ProfileDiv({ status, who, usr, func }: { status: Map<string, string> , who: Boolean; usr: IUser; func: any }) {
	const [postContent, setPostContent] = useState("");
	const [isFriend, setisFriend] = useState<boolean>(false);
	const [usrImg, setUsrImg] = useState("")



	useEffect(() =>{
		setUsrImg(usr.avatar)
	},[usr])
	useEffect(() =>{
		if (!who && status.get(usr.user42))
			setisFriend(true)
		else
			setisFriend(false)
	},[status])
	const updateStatus =  () => {
		fetch(`http://${ip}3001/profile/updateStatus`, {
			method: "PATCH",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				status: postContent ,
			}),
		}).then(response => {
			if (!response.ok) {
				HandleError(response)
			} else {
			response.json().then((data)=> {
					func(data);
					toast("Updated Succefully!");
				}).catch(()=>{})
			}
		}).catch(()=>{})
		};
	const RmFR = () => {
        fetch(`http://${ip}3001/invite/friend?friend=${usr.id}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((data) =>
			{
				if (data.status === 200)
				{
					toast("Deleted Friend succesfully")
					return ;
				}
				HandleError(data)
			})
            .catch(()=>{});
    };
const addFR = () => {
        fetch(`http://${ip}3001/invite/friend?friend=${usr.id}`, {
            method: "POST",
            credentials: "include",
        })
		.then((data) =>
		{
			if (data.status === 200)
			{
				toast("added Friend Succesfully")
				return ;
			}
				HandleError(data)
		}).catch(() => {});
    };
	useGetFrienshipsStatus(setisFriend, usr);
	return (
		<div className="ProfileDiv Ft min-[0px]:mx-5 2xl:m-auto flex min-[0px]:flex-col-reverse lg:flex-row border-solid border-4 border-black shadow-[2px_4px_0px_0px_#000301] p-10 2xl:w-full max-w-[1536px]">
			<div className="LeftDiv flex flex-col lg:w-[75%] justify-between ">
				<h1 className="ModUserName min-[0px]:text-xl md:text-3xl font-bold font-Nova uppercase">
					{usr.user42}
				</h1>
				<div className="SocialHolder flex sm:gap-y-2 justify-content-center w-[40%]">
					<div className="mt-4">
						<h2 className="UserNick font-Nova min-[0px]:text-lg md:text-2xl font-semibold mr-8 uppercase">
							{usr.nickname}
						</h2>
					</div>
					{!who ? (
						<div className="flex flex-row mt-2 w-full">
							{isFriend ? (
								<img
									src={BlockPerson}
									className="mt-2 mr-4 h-[32px] w-[32px]"
									alt="Blocking a user"
									onClick={RmFR}
								></img>
							) : (
								<img
									src={AddPerson}
									className="mt-2 mr-4 lg:h-[2rem] lg:w-[2rem]"
									alt="Adding a user"
									onClick={addFR}
								></img>
							)}
						</div>
					) : null}
				</div>
				<div className="flex flex-col mt-2">
					{status.get(usr.user42) == "ONLINE" ? (
						<p className="UserStatus text-sm sm:text-base lg:text-xl mt-2 mr-4 text-sucessColor font-extrabold font-Nova">
							{status.get(usr.user42)}
						</p>
					) : status.get(usr.user42) == "OFFLINE" ? (
						<p className="UserStatus text-xl mt-2 mr-4 text-PersianRed font-extrabold font-Nova">
							{status.get(usr.user42)}
						</p>
					) : (
						<p className="UserStatus text-xl mt-2 mr-4 text-InGame font-extrabold font-Nova animate-pulse">
							{status.get(usr.user42)}
						</p>
					)}
					{who ? (
						<div>
							<textarea
								maxLength={700}
								className="UserDescription min-[0px]:mt-3 mr-4 sm:mt-3 md:mt-4 min-[0px]:text-base md:text-lg w-[90%] min-h-[5rem] max-h-[12rem] text-[#959490] ring-4 p-3 m-1 border-black ring-black hover:ring-blue shadow-[2px_4px_0px_0px_#000301]"
								placeholder={!usr?.status ? "Tell Us About Yourself ..." : usr?.status}
								onChange={(e) => setPostContent(e.target.value)}
							></textarea>
							<button
								type="submit"
								onClick={async () => await updateStatus()}
								className="border-black border-4 border-solid w-[25%] mt-6 font-Nova p-2 text-lg  text-white font-bold bg-black hover:bg-buttonColor hover:text-black  shadow-[2px_8px_6px_0px_#747474]"
							>
								submit
							</button>
						</div>
					) : usr.status ? (
						<p className="truncate w-[30%] min-[0px]:text-base md:text-[21px] text-[#959490] font-extrabold font-Nova my-8 p-5 italic capitalize border-black border-solid border-2 shadow-[2px_4px_0px_0px_#000301]">
							{usr.status}
						</p>
					) : (
						<p className="w-[30%] min-[0px]:text-base md:text-[20px] text-[#959490] font-extrabold font-Nova my-8 p-4 italic capitalize border-black border-solid border-2 shadow-[2px_4px_0px_0px_#000301]">
							No Status set
						</p>
					)}
				</div>
			</div>
			<div className="RightDiv flex place-content-start lg:place-content-center w-[90%] lg:w-[40%] lg:m-auto py-6 lg:py-0">
				<div>
					{who ? <UploadTest  setUsrImg={setUsrImg}/> : null}
					<img
						src={ !usrImg.length ? Profil : usrImg}
						className="border-4 min-[0px]:h-[12rem] lg:h-[14rem] min-[0px]:w-[12rem] lg:w-[14rem] xl:w-[16rem] xl:h-[16rem] border-black border-solid shadow-[2px_4px_0px_0px_#000301]"
						alt="User profile picture"
					></img>
				</div>
			</div>
		</div>
	);
}
