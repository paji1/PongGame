import React from 'react';
import './index.css';
import App from './App';
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([{
	path: "/",
	element: <App />
}])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
	<RouterProvider router={router} />
  </React.StrictMode>
);

