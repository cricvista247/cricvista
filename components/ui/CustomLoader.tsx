// components/CricketBallLoader.tsx
import React from "react";
import Lottie from "lottie-react";
import cricketBallAnimation from "../../Bouncing Cricket Ball.json";

interface LoaderProps {
  message?: string;
}

const CustomLoader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="w-40 h-40">
        <Lottie animationData={cricketBallAnimation} loop={true} />
      </div>
      <p className="mt-4 text-gray-700 font-medium text-lg">
        {message || "Loading..."}
      </p>
    </div>
  );
};

export default CustomLoader;
