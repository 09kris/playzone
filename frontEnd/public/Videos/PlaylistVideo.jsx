import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const PlaylistVideo = ()=>{
    const [videos, setVideos] = useState([]);
    const [message, setMessage] = useState("");
    const { playlistId } = useParams();

    // Fetch all videos in the playlist
    const fetchVideos = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/functionality/getPlaylistVideos/${playlistId}`, {
                withCredentials: true,
            });
            console.log("Playlist Videos API response:", res);
            
            setVideos(res.data.data); // Assuming the backend returns { data: [ ...videos ] }
        } catch (err) {
            console.error("Failed to fetch videos:", err);
            setMessage("Failed to fetch videos");
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Playlist Videos</h1>
            {message && <p className="text-red-500">{message}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {videos.map((video) => (
        <Link key={video._id} to={`/${video._id}`} className="bg-white p-4 shadow rounded block">
                    <div className="bg-white p-4 shadow rounded">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover rounded" />
                        <h3 className="text-lg font-bold mt-2">{video.title}</h3>
                    </div>
                </Link>
                ))}
            </div>
        </div>
    );
}

export default PlaylistVideo;