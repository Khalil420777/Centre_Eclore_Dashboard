"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../Sidebar/page";

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
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Fetch treatment types
  const fetchType = async () => {
    try {
      const response = await fetch(`http://localhost:3001/TYPES/${id}`);
      const data = await response.json();
      setType(data.data);
      console.log("Fetched types:", data.data);
      
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

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Les Types Du Traitement</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {type.map((t) => {
            const price = prices[t.idtypes];  
            const duration = durations[t.idtypes];  

            return (
              <div
                key={t.idtypes}
                className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer"
              >
                <img
                  src={t.image}
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
