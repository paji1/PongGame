import React, { FC, useEffect } from "react";
import { AnimatedElement } from "../game/GameSetup";
import karontdo from "../../assets/42.png";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface LoadingProps {}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Loading: FC<LoadingProps> = () => {
	const navigate = useNavigate();
	useEffect(() => {
	  async function makeRequest() {
	    const data : string | undefined = await Cookies.get('userData');

	    await delay(1000);
	    if (window.opener)
	    {
	      await window.opener.postMessage({
	        success: (data) ? true : false,
	        payload: data
	      }, "http://localhost:3000/");
	    }
	  }
	  makeRequest();
	});
	if (!window.opener)
	{
	  navigate('/not-found', { replace: true });
	  return <></>;
	}

	return (
		<div className="flex flex-row-reverse items-center justify-center gap-14 ">
			<div className="flex flex-col-reverse items-center justify-center gap-14 " >
				<h1 className="font-bold"> Intra login ....</h1>
				<img className="w-20 h-auto" src={karontdo} alt="42" />
			</div>
				<div className={`w-[50%] h-auto items-center justify-center `}>
					<AnimatedElement />
				</div>
		</div>
	);
};

export default Loading;
