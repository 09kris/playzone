import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance"; // Your axios config with interceptor

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Optional: for UI loading states

  useEffect(() => {
    // Auto-fetch current user if tokens are valid
    const fetchUser = async () => {
      try {
        const res = await axios.post("/users/authUser"); // Your protected route
        setUser(res.data.data); // User object
      } catch (err) {
        console.log("No valid session", err.response?.data?.message || err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
