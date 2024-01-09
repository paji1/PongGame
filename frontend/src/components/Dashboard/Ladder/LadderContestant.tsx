import Profil from "../../../assets/profile.png";
import Rank from "../../../assets/Rank.png";

export default function Contestant(props: any) {
	return (
		<div className="flex p-auto border-2 border-solid border-black box-border min-[0px]:gap-x-6 md:gap-x-14 p-2 align-center w-[100%] m-auto my-6 shadow-[2px_4px_0px_0px_#000301] bg-white">
			<div className=" justify-between w-[30%] hidden sm:flex items-center">
				<img src={Rank} className="PositionLogo  my-2 mr-0 w-[25%] lg:w-[22%] h-[70%] ml-8"></img>
				<img
					src={props.pic}
					className="Profil ml-6 w-[35%] m-[1px] lg:w-[35%] hidden sm:block border-2 border-solid border-black lg:ml-1 shadow-[2px_4px_0px_0px_#000301]"
				></img>
			</div>
			<div className="flex justify-between w-full sm:w-[60%] items-center">
				<h1 className="ml-0 text-start font-Nova min-[0px]:text-sm sm:text-xl md:text-2xl lg:text-3xl truncate">
					{props.Name}
				</h1>
				<h1 className="font-Nova min-[0px]:text-sm sm:text-xl md:text-2xl truncate animate-pulse font-extrabold text-sucessColor lg:mr-10">
					{props.score}
				</h1>
			</div>
		</div>
	);
}
