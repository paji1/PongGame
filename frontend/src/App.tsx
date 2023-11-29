import React from 'react';
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import TestSideBar from './components/sidebar/Tmp';
import NotifBar from './components/notifbar/NotifBar';

const App = () => {
	return (
	<div>
		<Navbar />
		<TestSideBar />
		<NotifBar />
	</div>
)}

export default App;
