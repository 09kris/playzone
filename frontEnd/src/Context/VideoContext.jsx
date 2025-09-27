import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance"; // Axios instance with interceptor

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("/videos/getall");
        setVideos(res.data?.data || []);
      } catch (err) {
        console.error(
          "Failed to fetch videos:",
          err.response?.data?.message || err.message
        );
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <VideoContext.Provider value={{ videos, setVideos, loading }}>
      {children}
    </VideoContext.Provider>
  );
};

// Custom hook
export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};
export default VideoContext;