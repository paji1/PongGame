import React from 'react';
import './index.css';
import App from './App';
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { currentUser , CurrentUser} from './components/Context/AuthContext';
import profileplaceholder from './assets/profileplaceholder.png'
import GameMain from './components/game';


const user: CurrentUser = {
	id: 1,
	user42: "zbi",
	nickname: "qalwa",
	avatar: profileplaceholder,
	status: "Lorem ipsum dolor sit amet, consectetur adipis dolor sit amet, sed diam"
}

const router = createBrowserRouter([{
	path: "/",
	element: <App />
},
{
	path: "/game",
	element: <GameMain />
}])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <currentUser.Provider value={user} >
		<RouterProvider router={router} />
	</currentUser.Provider>
);

