import Xlogo from "../../assets/X.png";
import InstagramLogo from "../../assets/instagram.png";
import LinkedinLogo from "../../assets/linkedin.png";
import GithubLogo from "../../assets/github.png";

export default function SocialMedia() {
	return (
		<div className="SocialMedia flex gap-3">
			<img src={GithubLogo} alt="pic"></img>
			<img src={LinkedinLogo} alt="pic"></img>
			<img src={InstagramLogo} alt="pic"></img>
			<img src={Xlogo} alt="pic"></img>
		</div>
	);
}
