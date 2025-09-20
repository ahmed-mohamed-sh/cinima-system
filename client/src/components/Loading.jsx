import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
    const {nextUrl} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(nextUrl){
            setTimeout(() => {
                navigate('/' + nextUrl);
            },8000)
        }
    })
    return (
        <div className="flex items-center justify-center h-[80vh]">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-[#F84565]"></div>
        </div>
    );
};

export default Loading;
