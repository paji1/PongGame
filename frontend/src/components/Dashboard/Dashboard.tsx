import Navbar from "../Navbar";
import Footer from "../Footer";
import ProfileDiv from "./UserProfile";
import Carousel from "./Carousel/Carousel";
import Stats from "../Dashboard/Stats";
import Ladder from './Ladder/LeaderBoard'
import contestants from './Ladder/LeaderBoard'

export default function  Dashboard(){
	return (

		<div className="flex flex-col gap-y-16" >
			<ProfileDiv Username="AYMANE" nickname="BASILISK" State="Online"/>
			<Carousel/>
			<Stats/>
			<Ladder contestants={contestants}/>
			<Footer/>
		</div>
	);
} 