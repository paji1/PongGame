import React from 'react';
import './index.css';
import App from './App';
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { currentUser , CurrentUser} from './components/Context/AuthContext';
import profileplaceholder from './assets/profileplaceholder.png'


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
}])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <currentUser.Provider value={user} >
		<RouterProvider router={router} />
	</currentUser.Provider>
  </React.StrictMode>
);

