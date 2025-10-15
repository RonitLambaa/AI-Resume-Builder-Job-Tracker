import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice"; // make sure you exported logout from authSlice
import authApi from "../api/authApi";

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      authApi.logout(); // calls backend /logout route
      } catch (e) {
        console.error(e);
      }

      dispatch(logout());
      navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="group flex items-center gap-2 px-3 py-1 rounded-md hover:text-white text-black transition-colors duration-200 cursor-pointer hover:bg-emerald-600 relative bottom-1 z-10"
    >
      {/* Inline logout SVG */}
      <svg
        className="w-5 h-5 stroke-black group-hover:stroke-white transition-colors"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round">
        <rect x="3" y="3" width="12" height="18" rx="2" ry="2"></rect>
        <path d="M21 12h-8"></path>
        <path d="M18 9l3 3-3 3"></path>
      </svg>
      <span>Logout</span>
    </button>
  );
}

export default LogoutButton;
