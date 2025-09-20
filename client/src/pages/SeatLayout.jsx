import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { assets} from "../assets/assets";
import Loading from "../components/Loading";
import {ArrowRight, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";

const SeatLayout = () => {
    const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I","J"]];
    const {id, date} = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedTime, setSelectedTime] = useState([]);
    const [show, setShow] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    // const navigate = useNavigate();
    const {axios, getToken, user} = useAppContext()
    const getShow = async () => {
            try {
                const { data } = await axios.get(`/api/show/${id}`);
                if (data.success) {
                    setShow(data); 
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        useEffect(() => {
            getShow();
        },[])
    const handleSeatClick = (seatId) => {
        if (!selectedTime) {
            return toast("Please select a showtime first");
        }if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
           return toast("You can't select more than 5 seats at a time");
        }
        if(occupiedSeats.includes(seatId)){
            return toast("This seat is already taken");
        }
         setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter(seat => seat !== seatId);
            }
            return [...prev, seatId];
        });
    }
    const renderSeats = (row, count = 9) => (
        <div key={row} className="flex gap-2 mt-2">
            {Array.from({ length: count }, (_, i) => {
                const seatId = `${row}-${i+1}`;
                return (
                    <button key={seatId} onClick={() => handleSeatClick(seatId)} className={`w-8 h-8 rounded border border-[#F84565] cursor-pointer ${selectedSeats.includes(seatId) && "bg-[#F84565] text-white"}
                    ${occupiedSeats.includes(seatId) && "opacity-50 bg-gray-600 text-white"}`}>
                        {seatId}
                    </button>
                );
            })}
        </div>
    )

const getOccupiedSeats = async () => {
  if (!selectedTime?.showId) {
    console.warn("No showId found in selectedTime");
    return;
  }

  try {
    console.log("Fetching seats for showId:", selectedTime.showId);
    const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`);
    if (data.success) {
      setOccupiedSeats(data.occupiedSeats);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  if (selectedTime?.showId) {
    getOccupiedSeats();
  }
}, [selectedTime]);

   const bookTickets = async () => {
  try {
    if (!user) return toast.error("Please login to book tickets");
    if (!selectedTime || !selectedSeats.length) return toast("Please select a showtime and seats first");

    const { data } = await axios.post(
      "/api/booking/create",
      {
        showId: selectedTime.showId,   // ✅ نستخدم الـ showId من selectedTime
        selectedSeats,                 // ✅ نفس الاسم اللي الباك إند متوقعه
      },
      {
        headers: { Authorization: `Bearer ${await getToken()}` },
      }
    );

    if (data.success) {
      window.location.href = data.url;
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong while booking");
  }
};


  return show ? (
    <div className="mt-32 flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10">
        {/* Available Timings */}
        <div className="w-60 bg-[#F84565]/10 border border-[#F84565]/20 rounded-lg py-10 h-max md:sticky md:top-30">
            <p className="text-lg font-semibold px-6">Available Timings</p>
            <div className="mt-5 space-y-1">
                {show.dateTime[date].map((item) => (
                    <div key={item} onClick={() => setSelectedTime(item)} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.time === item.time ? "bg-[#F84565] text-white" : "hover:bg-[#F84565]/20"}`}>
                        <ClockIcon className="w-4 h-4"/>
                        <p className="text-sm">{isoTimeFormat(item.time)}</p>
                    </div>
                ))}
            </div>
        </div> 
        {/* Seat Layout */}
        <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
            <BlurCircle top="-100px" left="-100px"/>
            <BlurCircle top="-100px" right="0px"/>
            <h1 className="text-2xl font-semibold mb-4">Select Your Seat</h1>
            <img src={assets.screenImage} alt="screen"/>
            <p className="text-gray-400 text-sm mb-6 text-center">SCREEN SIDE</p>
            <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
                    {groupRows[0].map((row) => renderSeats(row)) }
                </div>
                 <div className="grid grid-cols-2 gap-11">
                {groupRows.slice(1).map((group, index) => (
                    <div key={index}>
                        {group.map((row) => renderSeats(row))}
                    </div>
                ))}
            </div>
            </div>
            <button onClick={bookTickets} className="mt-10 flex items-center gap-1 px-6 py-3 bg-[#F84565] hover:bg-[#F84565]/80 transition text-sm rounded-full font-medium cursor-pointer">
  proceed to checkout
  <ArrowRight strokeWidth={2} className="w-4 h-4" />
</button>
        </div>
    </div>
  ) : (
    <Loading/>
  );
};

export default SeatLayout;
