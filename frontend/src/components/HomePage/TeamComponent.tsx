import TeamMembers from "./TeamMemberComponent";
import Spliter from "../Spliter";

export default function Team() {
	return (
		<div id="our-team">
			<Spliter title="OUR TEAM" />
			<div className="flex flex-col gap-y-12 max-w-[1536px] min-[0px]:mx-12 2xl:m-auto">
				<TeamMembers
					Color={"bg-primary"}
					order=""
					name="SOUFIANE ELKHAMLICHI"
					description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed risus at nulla porttitor interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras faucibus quam a velit sodales pellentesque. Nulla congue, eros non vestibulum malesuada, risus nisl interdum elit, et sagittis nulla sapien congue leo. Duis sit amet sagittis odio, vel facilisis urna. Suspendisse sed ipsum nec ex tincidunt iaculis. Curabitur eget sagittis nunc, eget luctus quam."
				/>
				<TeamMembers
					Color={"bg-buttonColor"}
					order={"order-last"}
					name="TAHA EL MOUHAJIR"
					description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed risus at nulla porttitor interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras faucibus quam a velit sodales pellentesque. Nulla congue, eros non vestibulum malesuada, risus nisl interdum elit, et sagittis nulla sapien congue leo. Duis sit amet sagittis odio, vel facilisis urna. Suspendisse sed ipsum nec ex tincidunt iaculis. Curabitur eget sagittis nunc, eget luctus quam."
				/>
				<TeamMembers
					Color={"bg-JacobsBlueColor"}
					order=""
					name="OUAIL ZAHIR"
					description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed risus at nulla porttitor interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras faucibus quam a velit sodales pellentesque. Nulla congue, eros non vestibulum malesuada, risus nisl interdum elit, et sagittis nulla sapien congue leo. Duis sit amet sagittis odio, vel facilisis urna. Suspendisse sed ipsum nec ex tincidunt iaculis. Curabitur eget sagittis nunc, eget luctus quam."
				/>
				<TeamMembers
					Color={"bg-secondary"}
					order={"order-last"}
					name="AYMANE ECHAFII"
					description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed risus at nulla porttitor interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras faucibus quam a velit sodales pellentesque. Nulla congue, eros non vestibulum malesuada, risus nisl interdum elit, et sagittis nulla sapien congue leo. Duis sit amet sagittis odio, vel facilisis urna. Suspendisse sed ipsum nec ex tincidunt iaculis. Curabitur eget sagittis nunc, eget luctus quam."
				/>
				<TeamMembers
					Color={"bg-errorColor"}
					order=""
					name="MAHMOUD MEZIANI"
					description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed risus at nulla porttitor interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras faucibus quam a velit sodales pellentesque. Nulla congue, eros non vestibulum malesuada, risus nisl interdum elit, et sagittis nulla sapien congue leo. Duis sit amet sagittis odio, vel facilisis urna. Suspendisse sed ipsum nec ex tincidunt iaculis. Curabitur eget sagittis nunc, eget luctus quam."
				/>
			</div>
		</div>
	);
}
