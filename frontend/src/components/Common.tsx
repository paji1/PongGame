export const HoverDiv = ({toggleChatBar}: {toggleChatBar: any}) => (
	<div
	className="fixed inset-0 bg-textColor bg-opacity-50 z-40 transition-all duration-300"
	onClick={() => toggleChatBar()}
	aria-hidden="true"
	></div>
)