import Socials from './SocialMediaComponent'
import ProfilePic from '../../assets/profile.png'

export const TeamLinks = [
	{
		name : "SOUFIANE ELKHAMLICHI",
		githubLink : "https://github.com/MGS15",
		InstagramLink : "https://instagram.com/soufiane.mgs",
		LinkedinLink : "https://linkedin.com/soufiane.mgs",
		XLink : "https://x.com/soufiane.mgs",
	},
	{
		name : "TAHA EL MOUHAJIR",
		githubLink : "https://github.com/paji1",
		InstagramLink : "https://github.com/MGS15",
		LinkedinLink : "https://github.com/7ach7ouch101",
		XLink : "https://x.com/paji1",
	},
	{
		name : "OUAIL ZAHIR",
		githubLink : "https://github.com/waelzahir",
		InstagramLink : "https://github.com/MGS15",
		LinkedinLink : "https://github.com/ozahir",
	},
	{
		name : "AYMANE ECHAFII",
		githubLink : "https://github.com/aymane-1",
		InstagramLink : "https://github.com/MGS15",
		LinkedinLink : "https://github.com/7ach7ouch101",
		XLink : "https://x.com/aymane.echafii", 
	},
	{
		name : "MAHMOUD MEZIANI",
		githubLink : "https://github.com/7ach7ouch101",
		InstagramLink : "https://github.com/7ach7ouch101",
		LinkedinLink : "https://github.com/7ach7ouch101",
		XLink : "https://x.com/7ach7ouch101",
	},
]

export default function TeamMember(props: any){
	return (
		<div className={`Member ${props.Color} transition duration-500 ease-in-out font-pixelify max-w-[1536px] min-[0px]:place-content-center lg:px-4 min-[730px]:flex-row lg:flex min-[0px]:mx-5 border-solid border-4 border-black shadow-[2px_4px_0px_0px_#000301] min-[0px]:p-7`}>
		  <div className={`${props.order} border-solid border-4 border-black bg-white min-[0px]:p-4 sm:p-5 md:p-6 flex place-content-center min-[0px]:w-[40%] sm:w-[35%] min-[0px]:ml-[13%] lg:m-auto lg:w-[30%] lg:mx-9`}>
		  	<img src={ProfilePic} alt='pic' className=' m-4 sm:w-[320px] lg:w-[330px]md:p-12 border-solid border-black border-4 bg-DefaultColor'></img >
		  </div>
		  <div className='flex-col justify-center w-[75%] lg:p-7 m-auto '>
			<h1 className='min-[0px]:text-xl md:text-2xl lg:text-3xl xl:text-5xl my-3'>{props.name}</h1>
			<Socials TeamLinks={TeamLinks}/>
		   <p className='min-[0px]:text-md md:text-xl xl:text-2xl my-3'> {props.description} </p>
		  </div>
		</div>
	);
}