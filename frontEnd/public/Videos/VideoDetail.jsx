import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../src/utils/axiosInstance";
import { useUser } from "../../src/Context/UserContext";

const VideoDetail = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showPlaylistList, setShowPlaylistList] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);

  // Fetch video details
  const fetchVideo = async () => {
    try {
      const res = await axios.get(`videos/${id}`);
      setVideo(res.data.data);
    } catch (err) {
      console.error("Error fetching video:", err);
    }
  };

  // Like toggle
  const toggleLike = async () => {
    try {
      await axios.get(`functionality/video/${id}`);
      setLiked(!liked);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // Subscribe toggle
  const Subscribe = async () => {
    try {
      await axios.get(`functionality/subscribe/${id}`);
      setSubscribed(!subscribed);
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  };

  // Add comment
  const addComment = async () => {
    try {
      await axios.post(`functionality/comment/${id}`, { comment });
      setComment("");
      fetchComments(); // re-fetch comments after posting
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/functionality/getComment/${id}`);
      setComments(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  // Fetch user's playlists
  const fetchUserPlaylists = async () => {
    try {
      const res = await axios.get("/functionality/getAllPlaylists", {
        withCredentials: true,
      });
      setUserPlaylists(res.data.data || []);
      setShowPlaylistList(true);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    }
  };

  // Add video to selected playlist
  const handleAddToPlaylist = async (playlistId) => {
    try {
      await axios.post(
        `/functionality/addVideoToPlaylist/${id}/${playlistId}`,
        {},
        { withCredentials: true }
      );
      alert("Video added to playlist successfully!");
      setShowPlaylistList(false);
    } catch (err) {
      console.error("Failed to add video to playlist:", err);
      alert(err?.response?.data?.message || "Error adding to playlist");
    }
  };

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [id]);

  if (!video) return <p>Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6 bg-[#f9f9f9] min-h-screen">
      {/* Main Video Section */}
      <div className="flex-1">
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-md">
          <video src={video.videoFile} controls className="w-full h-full" />
        </div>

        <h2 className="text-2xl font-semibold mt-4">{video.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{video.description}</p>

        {/* Buttons: Like, Subscribe, Add to Playlist */}
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <button
            onClick={toggleLike}
            className={`px-5 py-2 rounded-full text-sm font-medium transition duration-300 ${
              liked ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {liked ? "Liked 👍" : "Like 👍"}
          </button>

          <button
            onClick={Subscribe}
            className={`px-5 py-2 rounded-full text-sm font-medium transition duration-300 ${
              subscribed
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {subscribed ? "Subscribed ✔" : "Subscribe"}
          </button>

          <button
            onClick={fetchUserPlaylists}
            className="px-5 py-2 rounded-full text-sm font-medium bg-gray-200 hover:bg-gray-300 transition duration-300"
          >
            Add to Playlist 📁
          </button>
        </div>

        {/* Playlist Dropdown */}
        {showPlaylistList && (
          <div className="mt-4 bg-white border rounded shadow p-4 w-full max-w-sm">
            <h4 className="font-semibold mb-2">Select Playlist</h4>
            <ul className="space-y-2">
              {userPlaylists.map((pl) => (
                <li key={pl._id}>
                  <button
                    onClick={() => handleAddToPlaylist(pl._id)}
                    className="w-full text-left hover:bg-gray-100 p-2 rounded"
                  >
                    {pl.name}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowPlaylistList(false)}
              className="text-sm text-red-500 mt-2"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Comment Input */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Add a Comment</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={addComment}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </div>

        {/* Comment List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Comments</h3>
          <ul className="space-y-4">
            {comments.map((comment, index) => (
              <li key={index} className="flex gap-3 border-b pb-3">
                <img
                  src={comment.owner?.avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{comment.owner?.fullName}</p>
                  <p className="text-sm text-gray-700">{comment.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Sidebar (Optional) */}
      <div className="w-full md:w-80">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Suggested Videos</h3>
          <p className="text-sm text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
