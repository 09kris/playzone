import React from "react";
import { useUser } from "../Context/UserContext";
import { Link } from "react-router-dom";
// import ProfilNavbar from "./ProfileNavbar";

const Header = () => {
  const { user } = useUser();

  return (
    <>
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-white">Menu</button>
          <span className="text-xl font-bold text-red-500">VidStream</span>
        </div>

        {/* Middle: Search bar */}
        <div className="hidden md:flex flex-1 mx-4">
          <input
            type="text"
            placeholder="Search videos..."
            className="w-full bg-gray-600 px-4 py-2 rounded-l-md text-white focus:outline-none"
          />
          <button className="bg-red-500 px-4 py-2 rounded-r-md hover:bg-red-600">
            Search
          </button>
        </div>

        {/* Right: User actions */}
        <div className="flex items-center space-x-4">
          <button className="hover:text-gray-300">Upload</button>

          {user && user.email ? (
            <Link to="/profile" className="hover:text-gray-300">
            <div className="flex items-center space-x-2">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <span className="hidden md:inline text-sm">{user.username || user.email}</span>
            </div>
            </Link>
          ) : (
            <a
              href="/login"
              className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 text-sm"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </header>
    {/* <ProfilNavbar /> */}
    </>
  );
};

export default Header;
