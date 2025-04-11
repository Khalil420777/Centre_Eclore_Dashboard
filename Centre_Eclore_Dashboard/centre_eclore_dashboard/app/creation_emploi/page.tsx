"use client"
import React, { useState } from 'react'
import Sidebar from '../Sidebar/page'
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation'

const page: React.FC = () => {
  const searchParams = useSearchParams();
  const idtypes = searchParams.get("id");
  const router = useRouter();
  
  const [creatingduration_price, setcreatingduration_price] = useState({
    duration: "",
    prices: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setcreatingduration_price((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!creatingduration_price.duration || !creatingduration_price.prices) {
      alert("Please fill in all required fields");
      return;
    }
    
    try {
      // Send the duration directly as a time string
      const requestData = {
        types_idtypes: idtypes,
        duration: creatingduration_price.duration,
        prices: parseFloat(creatingduration_price.prices)
      };
      
      console.log("Sending data:", requestData);
      
      const response = await fetch("http://localhost:3001/TYPES/durationsprices/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Reset form
      setcreatingduration_price({
        duration: "",
        prices: ""
      });
      
      // Navigate to treatments page
      router.push("/traitements");
      
    } catch (error) {
      console.error("Error creating duration and price:", error);
      alert(error instanceof Error ? error.message : "Failed to create duration and price. Please try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Add Duration and Price</h1>
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label htmlFor="duration" className="block mb-2">Duration (HH:MM)</label>
            <input
              type="time"
              id="duration"
              name="duration"
              value={creatingduration_price.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
              step="60"
            />
            <p className="text-sm text-gray-500 mt-1">Enter time in hours and minutes</p>
          </div>

          <div className="mb-4">
            <label htmlFor="prices" className="block mb-2">Price</label>
            <input
              type="number"
              id="prices"
              name="prices"
              value={creatingduration_price.prices}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
              placeholder="e.g. 50.00"
              step="0.01"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Duration & Price
            </button>
     
          </div>
        </form>
      </div>
    </div>
  )
}

export default page