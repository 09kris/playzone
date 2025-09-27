import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Links } from "react-router-dom";

const Playlists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });
    const [message, setMessage] = useState("");

    // Fetch all playlists
    const fetchPlaylists = async () => {
        try {
            const res = await axios.get("http://localhost:8000/functionality/getAllPlaylists", {
                withCredentials: true,
            });
            setPlaylists(res.data.data); // Assuming the backend returns { data: [ ...playlists ] }
        } catch (err) {
            console.error("Failed to fetch playlists:", err);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    // Handle playlist creation
    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:8000/functionality/createPlaylist",
                newPlaylist,
                { withCredentials: true }
            );
            setMessage(res.data.message);
            setNewPlaylist({ name: "", description: "" });
            setShowForm(false);
            fetchPlaylists(); // Refresh the list
        } catch (err) {
            console.error("Error creating playlist:", err);
            setMessage(err?.response?.data?.message || "Failed to create playlist");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">My Playlists</h1>

            {/* Create Playlist Button */}
            <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
                {showForm ? "Cancel" : "Create Playlist"}
            </button>

            {/* Playlist Form */}
            {showForm && (
                <form onSubmit={handleCreatePlaylist} className="mb-6 bg-white p-4 shadow rounded">
                    <div className="mb-4">
                        <label className="block font-semibold">Name</label>
                        <input
                            type="text"
                            value={newPlaylist.name}
                            onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-semibold">Description</label>
                        <textarea
                            value={newPlaylist.description}
                            onChange={(e) =>
                                setNewPlaylist({ ...newPlaylist, description: e.target.value })
                            }
                            className="w-full border p-2 rounded"
                            rows="3"
                        />
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                        Save Playlist
                    </button>
                </form>
            )}

            {/* Message */}
            {message && <p className="text-green-600 font-semibold mb-4">{message}</p>}

            {/* Playlists and Videos */}
            {playlists.length === 0 ? (
                <p>No playlists found.</p>
            ) : (
                // Inside your component:
                playlists.map((playlist) => (
                    <Link
                        key={playlist._id}
                        to={`/PlaylistVideo/${playlist._id}`}
                        className="block mb-6 bg-white shadow rounded p-4 hover:bg-gray-50 transition"
                    >
                        <h2 className="text-xl font-bold mb-2">{playlist.name}</h2>
                        <p className="text-gray-600">{playlist.description}</p>
                    </Link>
                ))
            )}
        </div>
    );
};

export default Playlists;
