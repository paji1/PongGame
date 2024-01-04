import Navbar from "../Navbar";
import Footer from "../Footer";
import ProfileDiv from "./UserProfile";
import Carousel from "./Carousel/Carousel";
import Stats from "../Dashboard/Stats";
import Ladder from "./Ladder/LeaderBoard";
import contestants from "./Ladder/LeaderBoard";
import { useSearchParams } from "react-router-dom";

export default function Dashboard() {
	const [params] = useSearchParams();
	const query = params.get("query");
	if (typeof query !== "undefined") {
	}

	return (
		<div className="flex flex-col gap-y-16">
			<ProfileDiv Username="AYMANE" nickname="BASILISK" State="Online" />
			<Carousel />
			<Stats />
			<Ladder contestants={contestants} />
			<Footer />
		</div>
	);
}
