"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../Sidebar/page'

// Define an interface for the treatment creation state
interface TreatmentState {
  
    title: string;
    Description: string;
    Image: File | null;
}

const TreatmentCreationPage: React.FC = () => {
  const router = useRouter();

  const [creatingTreat, setCreatingTreat] = useState<Omit<TreatmentState, 'idTreatments'>>({
    title: "",
    Description: "",
    Image: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreatingTreat((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCreatingTreat((prev) => ({ ...prev, Image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!creatingTreat.title || !creatingTreat.Description) {
      alert("Please fill in all required fields");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("title", creatingTreat.title);
    formDataToSend.append("Description", creatingTreat.Description);
    if (creatingTreat.Image) formDataToSend.append("image", creatingTreat.Image);
  
    try {
      const response = await fetch("http://localhost:3001/TREATMENT/create", {
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
  
      if (!responseData.idTreatments) {
        throw new Error("No treatment ID found in the response");
      }
  
      setCreatingTreat({ 
        title: "", 
        Description: "", 
        Image: null 
      });
      router.push(`/type?id=${responseData.idTreatments}`);
  
  
    } catch (error) {
      console.error("Error adding treatment:", error);
      alert(error instanceof Error ? error.message : "Failed to create treatment. Please try again.");
    }
  };
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Treatment</h1>
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">Treatment Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={creatingTreat.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="Description" className="block mb-2">Description</label>
            <textarea
              id="Description"
              name="Description"
              value={creatingTreat.Description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="Image" className="block mb-2">Treatment Image</label>
            <input
              type="file"
              id="Image"
              name="Image"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Treatment
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TreatmentCreationPage;