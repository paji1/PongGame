import React from "react"

interface buttonVariables {
	name: String,
	url: String
}

const MainButton : React.FC<buttonVariables> = (props) => (
	<a href={`${props.url}`}
		className={`bg-buttonColor text-textColor w-full py-2 px-8
			rounded-full shadow-buttonShadow border-solid border-textColor border-2
		`
		}>
		{props.name}
	</a>
)

export default MainButton