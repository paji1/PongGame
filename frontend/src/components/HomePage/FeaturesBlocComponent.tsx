export default function FeaturesBlocks(props: any) {
	return (
		<div
			className={`Ft transition duration-500 ease ${props.Color} font-pixelify flex flex-col p-16 mb-16 gap-y-8 text-2xl mb-18 w-full border-solid border-4 border-black shadow-[2px_4px_0px_0px_#000301]`}
		>
			<img
				src={props.Pic}
				className="m-auto bg-DefaultColor border-solid border-4 border-black w-[87%]"
				alt="pic"
			></img>
			<h1 className="text-3xl font-medium">{props.FeatureTitle}</h1>
			<p> {props.text} </p>
		</div>
	);
}
