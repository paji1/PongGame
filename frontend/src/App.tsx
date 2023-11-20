import React from 'react';
import Navbar from "./components/Navbar";
import ChatBar from "./components/SideBar";

const App = () => {
	return (
	<div>
		<Navbar isLogged={true} />
		<SideBar />
	</div>
)}

export default App;
