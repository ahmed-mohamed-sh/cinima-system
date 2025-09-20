import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import ReactPlayer from 'react-player'
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailerSection = () => {
    const [trailer, setTrailer] = useState(dummyTrailers[0]);
    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
            <p className="text-gray-300 font-medium text-lg max-w-[960px]">Trailers</p>
            <div className="relative mt-6">
                <BlurCircle top="-100px" left="90%"/>
                <ReactPlayer url={trailer.videoUrl} controls={false} className="mx-auto max-w-full" width="960px" height="540px"/>
            </div>
            <div className="grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
                {dummyTrailers.map((item) => {
                    const isSelected = trailer.image === item.image;
                    return (
                        <div
                            key={item.image}
                            className={`
                                relative transition duration-300 max-md:h-60 md:max-h-60 cursor-pointer
                                ${isSelected ? "z-10 -translate-y-3 opacity-100" : "opacity-50"}
                            `}
                            onClick={() => setTrailer(item)}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="rounded-lg w-full h-full object-cover brightness-75"
                            />
                            <PlayCircleIcon
                                strokeWidth={1.6}
                                className="absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2"
                            /> 
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TrailerSection;