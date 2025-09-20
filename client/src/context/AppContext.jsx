import { useContext, useState } from "react";
import { createContext } from "react";
import axios from "axios"
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovie, setFavoriteMovie] = useState([])
    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL
    const {user} = useUser()
    const {getToken} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const isFavorite = (movieId) => {
  return favoriteMovie.some((m) => m._id === movieId);
};

    const fetchIsAdmin = async () => {
        try{
            const {data} = await axios.get('/api/admin/is-admin', {headers:{Authorization: `Bearer ${await getToken()}`}})
            setIsAdmin(data.isAdmin) 
            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error('You are not authorized to access admin dashboard')
            }
        } catch(error){
            console.error(error)
        }
    }
    const fetchShows = async() => {
        try {
            const {data} = await axios.get('/api/show/all')
            if(data.success){
                setShows(data.shows)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            console.error(error)
        }
    }

     const fetchFavoriteMovies = async() =>{
        try{
            const {data} = await axios.get('/api/user/favorites',{headers:{Authorization: `Bearer ${await getToken()}`}})
            if(data.success){
                setFavoriteMovie(data.movies)
            }else{
                 toast.error(data.message)
            }
        }catch(error){
            console.error(error)
        }
     }
    
    useEffect(() => {
        fetchShows()
    },[])
    useEffect(() => {
    if (user) {
        fetchIsAdmin();
        fetchFavoriteMovies();
    }
}, [user, location.pathname]);


    const value = {
        axios,
        fetchIsAdmin,
        user, getToken,navigate,isAdmin,shows,
        favoriteMovie,fetchFavoriteMovies,image_base_url,
        isFavorite

    };
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    return useContext(AppContext);
}