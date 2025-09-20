import React, { useState } from "react";
import BlurCircle from "./BlurCircle";
import { ChevronLeftIcon,ChevronRightIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DateSelect = ({ dateTime, id }) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);
    const onBookHandler = () => {
        if (!selected) {
            return toast('Please select a date');
           
        } else {
            navigate(`/movies/${id}/${selected}`)
            scrollTo(0, 0);
        }
    }
  return (
    <div id="dateSelect" className="pt-30">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-[#F84565]/10 border border-[#F84565]/20 rounded-lg">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />
        <div>
            <p className="text-lg font-semibold">Choose Date</p>
            <div className="flex items-center gap-6 text-sm mt-5">
                <ChevronLeftIcon width={28}/>
                <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">{Object.keys(dateTime).map(date => (
                  <button key={date} className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${selected === date ? "bg-[#F84565] text-white" : "border border-[#F84565]/20"}`} onClick={() => setSelected(date)}>
                    <span>{new Date(date).getDate()}</span>
                    <span>{new Date(date).toLocaleString("en-US", { month: "short" })}</span>
                  </button>
                ))}</span>
                <ChevronRightIcon width={28}/>
            </div>
        </div>
        <button onClick={onBookHandler} className="bg-[#F84565] hover:bg-[#F84565]/80 transition-all rounded text-white px-8 py-2 cursor-pointer">Book Now</button>
      </div>
    </div>
  );
};

export default DateSelect;
