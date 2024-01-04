import React, { FC, useEffect } from 'react';
import { AnimatedElement } from '../game/GameSetup';


import Cookies from "js-cookie";
interface LoadingProps {}

const delay  = (ms : number ) => new Promise(
  resolve => setTimeout(resolve, ms)
);

const Loading: FC<LoadingProps> = () => {


  
  useEffect(() => {
    async function makeRequest() {
      const data : string | undefined = await Cookies.get('userData');
      
      await delay(1000);
      await window.opener.postMessage({
        success: (data) ? true : false,
        payload: "" 
      }, "http://localhost:3000/");
    }
    makeRequest();

  });

  return (
  <div className={`w-1/3 h-full flex items-center justify-center mx-auto my-auto`}>

  <AnimatedElement />
    
  </div>

  );
};


export default Loading;
