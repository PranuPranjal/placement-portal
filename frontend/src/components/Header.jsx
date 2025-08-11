import React from "react";
import { FaUser } from "react-icons/fa";
import nitlogo from "../assets/nitlogo.png";
import tnplogo from "../assets/tnp1.png";

const Header = () => {
  const [userName, setUserName] = React.useState("");

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const user = await res.json();
        setUserName(user?.name || user?.email || "");
      } catch (e) {}
    };
    loadUser();
  }, []);

  return (
    <div className="sticky top-0 z-50">
      {/* Top Header */}
      <header className="bg-red-800 text-white h-22 shadow-md px-6 py-3 sticky z-50 flex items-center justify-between">
        <img
          style={{ marginLeft: 12 }}
          src={nitlogo}
          alt="Left Logo"
          className="h-18 w-auto object-contain"
        />

        <h1
          className="text-xl font-bold text-white text-center flex-1"
          style={{ fontSize: 32 }}
        >
          Placement Management Portal
        </h1>

        <img
          style={{ marginRight: 12 }}
          src={tnplogo}
          alt="Right Logo"
          className="h-18 w-auto object-contain"
        />
      </header>

      {/* Welcome Bar */}
      <div className="h-12 bg-red-600 flex items-center justify-end pr-24 md:pr-32">
        {userName ? (
          <span
            className="text-sm md:text-base text-white font-semibold whitespace-nowrap flex items-center gap-2"
            style={{ marginRight: 40, fontSize: 18 }}
          >
            <FaUser /> Welcome, {userName}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
