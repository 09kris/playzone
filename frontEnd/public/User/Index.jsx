import React from "react";
import { useVideo } from "../../src/Context/VideoContext";
import { Link } from "react-router-dom";

const Index = () => {
  const { videos, loading } = useVideo();
  console.log(videos);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {videos.map((video) => (
        
        <Link key={video._id} to={`/${video._id}`} className="bg-white p-4 shadow rounded block">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="text-lg font-bold mt-2">{video.title}</h3>
        </Link>
      ))}
    </div>
  );
};

export default Index;
