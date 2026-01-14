import React from "react";
import { useAuth } from "../context/AppContext";
const HeroSection = () => {
  const { userInfo } = useAuth();
  return (
    <div>
      <div className="flex flex-col items-center  px-4 text-center text-gray-700 space-y-2 md:space-y-3">
        <span className="text-4xl mb-8">🔒</span>
        <h3 className="text-2xl capitalize">
          Hay {userInfo ? userInfo.name : "Developer"} 👍
        </h3>
        <h1 className="text-3xl md:text-4xl capitalize font-bold">
          welcome to our app
        </h1>
        <p className="text-sm md:text-[17px] max-w-md">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          Reprehenderit harum accusamus sint suscipit aperiam dignissimos.
        </p>
        <button className="border cursor-pointer border-gray-400 px-4 py-2 rounded-full text-gray-800 font-medium">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
