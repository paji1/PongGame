export default function Spliter(props: any) {
	return (
		<div className="Feat flex items-center place-content-evenly mx-auto p-3 max-w-[1536px] my-9">
			<hr className="leftHr border-solid border-black border-4 w-[40%] rounded-full"></hr>
			<p className="gap-y-50 text-center text-4xl font-pixelify">{props.title}</p>
			<hr className="rightHr border-solid border-black border-4 w-[40%] rounded-full"></hr>
		</div>
	);
}
