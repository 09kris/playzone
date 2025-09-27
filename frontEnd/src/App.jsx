import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Register from '../public/User/Register'
import Login from '../public/User/Login'
import React,{useEffect} from "react";
import './App.css'
import Index from "../public/User/Index";
import { useUser } from "./Context/UserContext";
import axiosInstance from "./utils/axiosInstance";
import VideoUpload from "../public/Videos/uploadVideo";
import { VideoProvider } from "./Context/VideoContext";
import VideoDetail from "../public/Videos/VideoDetail";
import Profile from "../public/User/Profile";
import ProfilNavbar from "./components/ProfileNavbar";
import LikedVideos from "../public/Videos/LikedVideos";
import Playlists from "../public/Videos/Playlist";
import PlaylistVideo from "../public/Videos/PlaylistVideo";


  const App = () => {
  // const { user, setUser } = useUser();
const {  loading } = useUser();

  if (loading) return <div>Loading...</div>;


  return (
    <>
      {/* <ProfilNavbar/> */}
        <VideoProvider>

      <Header />
       <div style={{ display: "flex" }}>
    <ProfilNavbar />
    <div style={{ flex: 1 }}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:id" element={<VideoDetail />} />
        <Route path="/" element={<Index />} />
        <Route path="/upload" element={<VideoUpload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/liked-videos" element={<LikedVideos />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/PlaylistVideo/:playlistId" element={<PlaylistVideo />} />

      </Routes>
      </div>
    </div>
        </VideoProvider>
    </>
  );
}

export default App;
