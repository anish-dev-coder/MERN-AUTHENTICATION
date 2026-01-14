import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center ">
      <Header />
      <HeroSection />
    </div>
  );
};

export default Home;
