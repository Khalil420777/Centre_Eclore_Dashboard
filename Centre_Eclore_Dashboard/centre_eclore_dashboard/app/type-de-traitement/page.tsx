"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../Sidebar/page";
import { useRouter } from "next/navigation";
import { PlusIcon } from 'lucide-react';

interface TYPEDATA {
  idtypes: string;
  title: string;
  description: string;
  image: string;
  Treatments_idTreatments: string;
}

interface PriceDuration {
  prices: number | null;
  duration: number | null;
}

const Page = () => {
  const [type, setType] = useState<TYPEDATA[]>([]);
  const [prices, setPrices] = useState<{ [key: string]: number | null }>({});
  const [durations, setDurations] = useState<{ [key: string]: number | null }>({});
  const [treatmentId, setTreatmentId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  
  // Fetch treatment types
  const fetchType = async () => {
    try {
      const response = await fetch(`http://localhost:3001/TYPES/${id}`);
      const data = await response.json();
      setType(data.data);
      console.log("Fetched types:", data.data);
      
      // Save the Treatment ID for navigation
      if (data.data.length > 0 && data.data[0].Treatments_idTreatments) {
        setTreatmentId(data.data[0].Treatments_idTreatments);
        console.log("Saved treatment ID:", data.data[0].Treatments_idTreatments);
      }
      
      // After fetching the types, fetch prices and durations for each type
      for (const t of data.data) {
        await fetchPriceAndDuration(t.idtypes);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  // Fetch prices and durations for each type
  const fetchPriceAndDuration = async (idtypes: string) => {
    try {
      const response = await fetch(`http://localhost:3001/TYPES/durationsprices/${idtypes}`);
      const data = await response.json();
      const { prices, duration } = data.data[0] || { prices: null, duration: null };
      
      // Update the prices and durations state
      setPrices((prevPrices) => ({ ...prevPrices, [idtypes]: prices }));
      setDurations((prevDurations) => ({ ...prevDurations, [idtypes]: duration }));

      console.log("Fetched prices & durations:", prices, duration);
    } catch (error) {
      console.error("Error fetching prices & durations:", error);
    }
  };

  useEffect(() => {
    if (id) fetchType();
  }, [id]);
  
  const handleNavigate = (id: string, title: string) => {
    router.push(`/emploi_du_temps?id=${id}&title=${encodeURIComponent(title)}`);
  };
  
  const handleAddMoreTypes = () => {
    // Navigate to the types component with treatment ID
    if (treatmentId) {
      console.log("Navigating with Treatments_idTreatments:", treatmentId);
      router.push(`/type?id=${treatmentId}`);
    } else {
      console.error("No Treatments_idTreatments available for navigation");
      alert("Cannot navigate: Treatment ID not found. Try returning to the treatments list.");
    }
  };
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Les Types Du Traitement</h1>
          <button 
            onClick={handleAddMoreTypes}
            className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 transition-colors"
            title="Ajouter un type"
          >
            <PlusIcon size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {type.map((t) => {
            const price = prices[t.idtypes];  
            const duration = durations[t.idtypes];  

            return (
              <div
                key={t.idtypes}
                className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer"
                onClick={() => handleNavigate(t.idtypes, t.title)}>
                <img
                  src={`http://localhost:3001/${t.image}`}
                  alt={t.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h2 className="text-lg font-semibold">{t.title}</h2>
                <p className="text-gray-600 text-sm">{t.description}</p>

                {price !== null && duration !== null && (
                  <div className="mt-2 text-gray-700">
                    <p>💰 Prix: {price} TND</p>
                    <p>⏳ Durée: {duration} </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;