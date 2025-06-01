"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../Sidebar/page'
import { useSearchParams } from "next/navigation";
import { PlusIcon } from 'lucide-react';

interface Protocole_steps {
  steps_number: number,
  title: string;
  description: string;
  duration: string,
  prices: number
  Protocole_types_idProtocole_types: string
  step_number: number;
  image?: string;
  idReservation_steps: number;
  note?: string;
}

const page = () => {
  const [step, setStep] = useState<Protocole_steps[]>([]);
  const [Protocoleid, setProtocoleid] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  useEffect(() => {
    fetchsteps()
  }, [])

  const fetchsteps = async () => {
    try {
      const response = await fetch(`http://localhost:3001/PROTOCOLE/steps/${id}`);
      const data = await response.json();
      
      // Sort the steps by step_number
      const sortedSteps = data.data.sort((a: Protocole_steps, b: Protocole_steps) => a.step_number - b.step_number);
      setStep(sortedSteps);
      if (data.data.length > 0 && data.data[0].Protocole_types_idProtocole_types) {
        setProtocoleid(data.data[0].Protocole_types_idProtocole_types);
      }
    } catch (error) {
      console.error("Error fetching steps:", error);
    }
  };

  const handlemore_R_S = () => {
    if (Protocoleid) {
      router.push(`/R_steps_creation?id=${Protocoleid}`);
    } else {
      console.error("No Protocole_types_idProtocole_types available for navigation");
      alert("Cannot navigate: Protocole_types_idProtocole_types not found. Try returning to the Protocoles list.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Protocol Steps</h1>
          <button 
            onClick={handlemore_R_S}
            className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 transition-colors"
            title="Add a step"
          >
            <PlusIcon size={24} />
          </button>
        </div>
        
        {step.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {step.map((stepItem) => (
              <div 
                key={stepItem.idReservation_steps} 
                className="border rounded-lg shadow-lg p-4 bg-white"
              >
                {stepItem.image && (
                  <img
                    src={`http://localhost:3001/${stepItem.image}`}
                    alt={stepItem.title}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                )}
                <h2 className="text-lg font-semibold">Step {stepItem.step_number}: {stepItem.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{stepItem.description}</p>
                
                <div className="mt-2 text-gray-700">
                  <p>💰 Prix: {stepItem.prices} TND</p>
                  <p>⏳ Durée: {stepItem.duration}</p>
                </div>

                {stepItem.note && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded">
                    <p className="text-xs text-yellow-700">Note: {stepItem.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No steps found for this protocol.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default page;