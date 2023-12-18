import { useState } from "react";
import { CarouselItem } from "./CarouselItem";
import { items }  from "./CarouselItem";

export default function Carousel(){
  const [activeIndex, setActiveIndex] = useState(0);
  
  const updateIndex = (newIndex: any) => {
    if (newIndex < 0) {
      newIndex = items.length - 1;
    } else if (newIndex > items.length - 1) {
      newIndex = 0;
    }
    setActiveIndex(newIndex);
  };
  return (
    <div  className="carousel min-[0px]:mx-5 2xl:m-auto flex flex-col justify-center border-solid border-4 border-black max-w-[1536px] shadow-[2px_4px_0px_0px_#000301]">
      <div>
        <h1 className="title font-Nova text-center font-bold min-[0px]:text-xl xl:text-2xl text-3xl p-4 border-4 border-solid border-black m-9 mb-0">ACHIEVEMENTS</h1>
      </div>
      <div
        className="overflow-hidden snap-mandatory snap-x inner whitespace-nowrap border-4 border-solid boder-black m-9"
      >
        {items.map((item) => {
          return(
            <div className="inline-flex w-full transition-transform delay-150 duration-1000 ease-in-out snap-center" style={{ transform: `translate(-${activeIndex * 100}%)`,
              }}>
              <CarouselItem item={item}/>
            </div>
            );
        })}
      </div>
      <div className="carousel-buttons flex justify-evenly mb-7 p-6 border-4 border-solid boder-black m-9 mt-0 min-[0px]:gap-x-[55%]">
        <button
          className="button-arrow cursor-pointer"
          onClick={() => {
            updateIndex(activeIndex - 1);
          }}
        >
          <span className="material-symbols-outlined">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.6667 2.33334V3.50001H16.3333V5.83334H14V8.16668H11.6667V10.5H9.33333V11.6667H8.16667V12.8333H7V15.1667H8.16667V16.3333H9.33333V17.5H11.6667V19.8333H14V22.1667H15.1667H16.3333V23.3333V24.5H18.6667V25.6667H21V22.1667H18.6667V19.8333H16.3333V17.5H14V15.1667H11.6667V12.8333H14V10.5H16.3333V8.16668H18.6667V5.83334H21V2.33334H18.6667Z" fill="#000301"/>
          </svg>
          </span>{" "}
        </button>
        <button
          className="button-arrow"
          onClick={() => {
            updateIndex(activeIndex + 1);
          }}
        >
          <span className="material-symbols-outlined">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.8333 12.8333V11.6666H18.6667V10.5H16.3333V8.16665H14V5.83331H11.6667V3.49998H9.33333V2.33331H7V5.83331H9.33333V8.16665H11.6667V10.5H14V12.8333H16.3333V15.1666H14V17.5H11.6667V19.8333H9.33333V22.1666H7V25.6666H9.33333V24.5H11.6667V22.1666H14V21V19.8333H16.3333V18.6666V17.5H18.6667V16.3333H19.8333V15.1666H21V14V12.8333H19.8333Z" fill="#000301"/>
          </svg>
          </span>
        </button>
      </div>
    </div>
  );
};
{/* <div className="min-[0px]:mx-5 2xl:m-auto flex flex-col justify-center border-solid border-4 border-black max-w-[1536px] shadow-[2px_4px_0px_0px_#000301] Ft"> */}
