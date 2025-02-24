"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Sidebar from '../Sidebar/page';

interface TraitementsDATA {
  idTreatments: string;
  title: string;
  Description: string;
  Image: string;
}

const Page = () => {
  const [Traitements, setTraitements] = useState<TraitementsDATA[]>([]);
  const router = useRouter();

  const fetchTraitements = async () => {
    try {
      const response = await fetch("http://localhost:3001/TREATMENT/treatments");
      const data = await response.json();
      setTraitements(data);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };

  useEffect(() => {
    fetchTraitements();
  }, []);

  const handleNavigate = (id: string) => {
    router.push(`/type-de-traitement?id=${id}`);
  };
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Les Traitements</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Traitements.map((traitement) => (
            <div 
              key={traitement.idTreatments} 
              className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer"
              onClick={() => handleNavigate(traitement.idTreatments)}
            >
              <img 
                src={traitement.Image} 
                alt={traitement.title} 
                className="w-full h-40 object-cover rounded-md mb-2" 
              />
              <h2 className="text-lg font-semibold">{traitement.title}</h2>
              <p className="text-gray-600 text-sm">{traitement.Description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
