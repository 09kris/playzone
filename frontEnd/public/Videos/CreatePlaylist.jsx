import React, { useState } from "react";
import axios from "axios";

const CreatePlaylist = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8000/functionality/createPlaylist",
        { name, description },
        { withCredentials: true } // Send cookies for auth
      );

      setMessage(res.data.message);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error creating playlist:", err);
      setMessage(
        err?.response?.data?.message || "Failed to create playlist"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Create a Playlist</h2>
      <form onSubmit={handleCreate}>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Playlist Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            className="w-full border rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Playlist
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-green-600 font-semibold">{message}</p>
      )}
    </div>
  );
};

export default CreatePlaylist;
