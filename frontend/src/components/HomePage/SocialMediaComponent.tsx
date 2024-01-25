import Xlogo from "../../assets/X.png";
import InstagramLogo from "../../assets/instagram.png";
import LinkedinLogo from "../../assets/linkedin.png";
import GithubLogo from "../../assets/github.png";
import TeamLinks from "./TeamMemberComponent";

let i = -1;

export default function SocialMedia({ TeamLinks }: { TeamLinks: any }) {
	i++;
	return (
		<div className="SocialMedia flex gap-3">
			{TeamLinks[i]?.githubLink ? (
				<a href={TeamLinks[i]?.githubLink} target="_blank">
					<img src={GithubLogo} alt="pic"></img>
				</a>
			) : null}
			{TeamLinks[i]?.InstagramLink ? (
				<a href={TeamLinks[i]?.InstagramLink} target="_blank">
					<img src={InstagramLogo} alt="pic"></img>
				</a>
			) : null}
			{TeamLinks[i]?.LinkedinLink ? (
				<a href={TeamLinks[i]?.LinkedinLink} target="_blank">
					<img src={LinkedinLogo} alt="pic"></img>
				</a>
			) : null}
			{TeamLinks[i]?.XLink ? (
				<a href={TeamLinks[i]?.XLink} target="_blank">
					<img src={Xlogo} alt="pic"></img>
				</a>
			) : null}
		</div>
	);
}
