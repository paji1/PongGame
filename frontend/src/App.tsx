import React from 'react';
import Navbar from "./components/Navbar";
import ChatBar from "./components/ChatBar";

const App = () => {
	return (
	<div>
		<Navbar isLogged={true} />
		<ChatBar />
	</div>
)}

export default App;
