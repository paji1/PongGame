import Navbar from "../Navbar";
import HomePageDiv from './HomePageComponent';
import Features from './Features';
import Team from './TeamComponent';
import Footer from '../Footer'

export default function HomePage(){
	return (
		<div className="flex flex-col gap-y-16 mt-16">
		<HomePageDiv/>
		<Features/>
		<Team/>
		<Footer/>
	</div>
)}

