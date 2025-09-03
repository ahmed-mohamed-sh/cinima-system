import React from "react";

const BlurCircle = ({ top="auto", left="auto", right="auto", bottom="auto" }) => {
  return (
    <div className="absolute -z-50 h-50 w-52 aspect-square rounded-full bg-[#F84565]/30 blur-xl" style={{ top, left, right, bottom }}></div>
  );
};

export default BlurCircle;