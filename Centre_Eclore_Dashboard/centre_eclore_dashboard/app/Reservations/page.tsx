"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/page';
import { useRouter } from "next/navigation";

interface employeur {
  idContact?: number;
  fullname: string;
  Description: string;
  image: string;
}

const page = () => {
  const [employeur, setemployeur] = useState<employeur[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchemployeurs();
  }, []);

  const fetchemployeurs = async () => {
    try {
      const response = await fetch("http://localhost:3001/CONTACT/");
      if (!response.ok) throw new Error("Failed to fetch employeur");
      const data = await response.json();
      setemployeur(data);
    } catch (error) {
      console.error("Error fetching employeurs:", error);
    }
  };

  const handleNavigate = (id: string) => {
    router.push(`/reservations_specific?id=${id}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Choisir Employeur</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {employeur.map((emp) => (
            <div 
              key={emp.idContact} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleNavigate(emp.idContact?.toString() || '')}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={`http://localhost:3001/${emp.image}`} 
                  alt={emp.fullname} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{emp.fullname}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">{emp.Description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;