import AddPerson from "../../assets/AddPerson.png";
import PersonAdded from "../../assets/PersonAdded.png";
import BlockPerson from "../../assets/BlockPerson.png";
import ChatLogo from "../../assets/Bubble.png";
import Profil from "../../assets/profile.png";

export default function ProfileDiv(props: any) {
	return (
		<div className="ProfileDiv Ft min-[0px]:mx-5 2xl:m-auto max-w-[1536px] flex min-[0px]:flex-col-reverse sm:flex-col-reverse md:flex-col-reverse lg:flex-row justify-content-evenly border-solid border-4 border-black shadow-[2px_4px_0px_0px_#000301] p-10">
			<div className="LeftDiv flex flex-col lg:w-[75%]">
				<h1 className="ModUserName min-[0px]:text-xl md:text-3xl font-bold font-Nova">{props.Username}</h1>
				<div className="SocialHolder flex min-[0px]:flex-col sm:flex-col md:flex-row lg:flex-row sm:gap-y-2 justify-content-center w-[40%]">
					<div className="mt-4">
						<h2 className="UserNick font-Nova min-[0px]:text-xl md:text-2xl font-semibold mr-8">
							{props.nickname}
						</h2>
					</div>
					<div className="flex flex-row mt-2">
						<img src={AddPerson} className="mt-2 mr-4 h-[32px] w-[32px]" alt="..."></img>
						<img src={PersonAdded} className="mt-2 mr-4 h-[32px] w-[32px]" alt="..."></img>
						<img src={BlockPerson} className="mt-2 mr-4 h-[32px] w-[32px]" alt="..."></img>
						<img src={ChatLogo} className="mt-2 mr-4 h-[32px] w-[32px]" alt="..."></img>
					</div>
				</div>
				<div className="flex flex-col mt-2 box-border">
					<p className="UserStatus text-xl mt-2 mr-4 ">{props.State}</p>
					<p className="UserDescription  min-[0px]:mt-3 mr-4 sm:mt-3 md:mt-4 min-[0px]:text-xl md:text-lg">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ante est, pulvinar ut elementu2xm
						ut, venenatis vitae ante. Maecenas ac sodales est, eu ullamcorper nulla. Lorem ipsum dolor sit
						amet, consectetur adipiscing elit. Aliquam erat volutpat.
					</p>
				</div>
			</div>
			<div className="RightDiv flex min-[0px]:place-content-start lg:place-content-center min-[0px]:w-[40%] sm:w-[35%] md:w-[20%] lg:w-[40%] lg:m-auto py-4">
				<img src={Profil} className="border-4 border-black border-solid" alt="..."></img>
			</div>
		</div>
	);
}
