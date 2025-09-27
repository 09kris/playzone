import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("username", formData.username);
    form.append("fullName", formData.fullName);
    form.append("email", formData.email);
    form.append("password", formData.password);
    if (avatar) {
      form.append("avatar", avatar);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/users/register",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

    //   console.log(" Registration response:", response.data);

      setIsError(false);
      setMessage(response.data?.message || "User registered successfully!");
    } catch (error) {
      console.error("❌ Registration error:", error);
      setIsError(true);
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-bold text-center">Register</h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <label className="block">
        <span className="text-sm text-gray-600">Avatar (optional):</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mt-1"
        />
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Register
      </button>

      {message && (
        <p
          className={`text-center text-sm ${
            isError ? "text-red-500" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default Register;
