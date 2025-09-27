import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
       const res = await axios.get('http://localhost:8000/functionality/likedVideos',{
        withCredentials: true,
       });
        console.log("Liked Videos API response:", res);
        setLikedVideos(res.data.data); // Use res.data.data to get the array
      } catch (err) {
        console.error("Error fetching liked videos:", err);
      }
    };

    fetchLikedVideos();
  }, []);

  return (
    <div className="liked-videos-container p-4">
      <h1 className="text-2xl font-bold mb-4">Liked Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {likedVideos.map((item) => (
          <Link
            key={item._id}
            to={`/${item.video._id}`}
            className="bg-white p-4 shadow rounded block"
          >
            <img
              src={item.video.thumbnail}
              alt={item.video.title}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-lg font-bold mt-2">{item.video.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LikedVideos;
