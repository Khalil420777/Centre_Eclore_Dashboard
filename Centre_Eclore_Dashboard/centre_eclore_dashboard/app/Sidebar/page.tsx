"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div className="flex">
      <div
        className={`bg-[#042652] text-white 
                    fixed h-screen transition-all 
                    duration-300 z-10 
                    ${isOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        {/* Sidebar content */}
        <div className="flex flex-col items-center mt-4">
          <div className="mt-4">
            <a
              className="text-white hover:text-[#33C8F9] cursor-pointer"
              onClick={() => router.push("/Clients")}
            >
              Clients
            </a>
          </div>
          <div className="mt-4">
            <a
              className="text-white hover:text-[#33C8F9] cursor-pointer"
              onClick={() => router.push("/Reservations")}
            >
              Reservations
            </a>
          </div>
          <div className="mt-4">
            <a
              className="text-white hover:text-[#33C8F9] cursor-pointer"
              onClick={() => router.push("/evenements")}
            >
              Événements
            </a>
          </div>
          <div className="mt-4">
            <a
              className="text-white hover:text-[#33C8F9] cursor-pointer"
              onClick={() => router.push("/les-traitements")}
            >
              Les Traitements
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 p-4 ${isOpen ? "ml-64" : "ml-0"}`}>
        {/* Button to toggle sidebar */}
        <div className="ml-auto">
          <button
            className="bg-blue-500 hover:bg-blue-700 
                       text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
