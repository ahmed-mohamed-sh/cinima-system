import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import TimeFormat from "../lib/TimeFormat";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const { axios, getToken, image_base_url, user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const getMyBookings = async () => {
    try{
      const {data} = await axios.get('/api/user/bookings',
         { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      if(data.success){
        setBookings(data.bookings)
      }
    }catch(error){
      console.error(error)
    }
    setLoading(false);
  };
  useEffect(() => {
    if (user){
      getMyBookings();
    }
  }, [user]);
  return !loading ? (
    <div className="relative px-6 md:px-16 lg:px-24 pt-32 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className="text-lg font-semibold mb-4">My Bookings</h1>
      {bookings.map((item,index) => (
        <div key={index} className="flex flex-col md:flex-row justify-between bg-[#F84565]/8 border border-[#F84565]/20 rounded-lg mt-4 p-2 max-w-3xl">
          <div className="flex flex-col md:flex-row">
            <img
  src={image_base_url + item.show.movie.poster_path}
  alt=""
  className="w-32 h-44 object-cover object-bottom rounded"
/>
            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">
                {item.show.movie.title} 
              </p>
              <p className="text-sm text-gray-400">{TimeFormat(item.show.movie.runtime)} </p>
              <p className="text-sm text-gray-400 mt-auto">{dateFormat(item.show.showDateTime)}</p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end md:text-right justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold mb-3">{currency}{item.amount}</p>
              {!item.isPaid && <button className="bg-[#F84565] px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer">Pay Now</button>}
            </div>
            <div className="text-sm">
              <p><span className="text-gray-400">Total Tickets:</span> {item.bookedSeats.length}</p>
              <p><span className="text-gray-400">Seat Number:</span> {item.bookedSeats.join(", ")}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Loading/>
  );
};

export default MyBookings;
