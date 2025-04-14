"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
import Image from "next/image";
import Cookies from "js-cookie";
const Sidebar: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Est-ce que tu es sûr ?");
    if (confirmLogout) {
      // Remove all possible traces of authentication
      Cookies.remove("token");
      Cookies.remove("token", { path: '/' });
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      
      // Force a page reload instead of just navigation
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex">
      <div className="bg-[#042652] text-white fixed h-screen w-64 z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mt-4">
          <Image src="/eclore_logo.png" alt="Eclore Logo" width={120} height={60} />
        </div>

        {/* Sidebar content */}
        <div className="flex flex-col items-center mt-6 space-y-6 flex-grow">
          <a className="text-white hover:text-[#33C8F9] cursor-pointer" onClick={() => router.push("/Clients")}>Clients</a>
          <a className="text-white hover:text-[#33C8F9] cursor-pointer" onClick={() => router.push("/Reservations")}>Reservations</a>
          <a className="text-white hover:text-[#33C8F9] cursor-pointer" onClick={() => router.push("/News")}>Événements</a>
          <a className="text-white hover:text-[#33C8F9] cursor-pointer" onClick={() => router.push("/traitements")}>Les Traitements</a>
          <a className="text-white hover:text-[#33C8F9] cursor-pointer" onClick={() => router.push("/Admins")}>Admins</a>
          <a className="text-white hover:text-[#33C8F9] cursor-pointer" onClick={() => router.push("/Annule")}>Annule</a>
        </div>

        {/* Logout icon at bottom */}
        <div className="mb-6 cursor-pointer text-white hover:text-[#33C8F9] flex items-center" onClick={handleLogout}>
          <IoLogOutOutline size={24} className="mr-2" />
          <span>Déconnexion</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 ml-64"></div>
    </div>
  );
};

export default Sidebar;
