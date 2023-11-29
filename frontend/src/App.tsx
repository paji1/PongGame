import React from 'react';
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import TestSideBar from './components/sidebar/Tmp';
import NotificationBar from './components/notifbar/NotificationBar';

const App = () => {
	return (
	<div>
		<Navbar />
		<TestSideBar />
		<NotificationBar />
	</div>
)}

export default App;
