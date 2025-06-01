"use client"
import React, { useState } from 'react'
import Sidebar from '../Sidebar/page'
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation'

const page: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  console.log(id);
  const router = useRouter();

  const [formData, setFormData] = useState({
    Protocole_types_idProtocole_types: id ,
    step_number: 0,
    title: "",
    description: "",
    image: null as File | null,
    duration: "",
    prices: "",
    note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'step_number' ? parseInt(value) || 0 : value 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.duration || !formData.prices) {
      alert("Please fill in all required fields");
      return;
    }

    const formDataToSend = new FormData();
  formDataToSend.append("Protocole_types_idProtocole_types", formData.Protocole_types_idProtocole_types || ""); // Add this line
  formDataToSend.append("step_number", formData.step_number.toString());
  formDataToSend.append("title", formData.title);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("duration", formData.duration);
  formDataToSend.append("prices", formData.prices);
  formDataToSend.append("note", formData.note);
  if (formData.image) formDataToSend.append("image", formData.image);

  try {
    const response = await fetch("http://localhost:3001/PROTOCOLE/create_R_steps", {
      method: "POST",
      body: formDataToSend,
    });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);
      
      // Reset form data
      setFormData({
        Protocole_types_idProtocole_types: id ,
        step_number: 0,
        title: "",
        description: "",
        image: null,
        duration: "",
        prices: "",
        note: "",
      });

      // Refresh the page to add another step
      window.location.reload();

    } catch (error) {
      console.log(error);
      console.error("Error adding reservation step:", error);
      alert(error instanceof Error ? error.message : "Failed to create reservation step. Please try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Reservation Step</h1>
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label htmlFor="step_number" className="block mb-2">Step Number</label>
            <input
              type="number"
              id="step_number"
              name="step_number"
              value={formData.step_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">Step Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

   <div className="mb-4">
  <label htmlFor="duration" className="block mb-2">Duration (HH:MM)</label>
  <input
    type="text"
    id="duration"
    name="duration"
    value={formData.duration}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded"
    required
    pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
    placeholder="HH:MM (e.g., 01:30 for 1 hour 30 minutes)"
  />
  <p className="text-sm text-gray-500 mt-1">Please enter time in HH:MM format</p>
</div>

          <div className="mb-4">
            <label htmlFor="prices" className="block mb-2">Price</label>
            <input
              type="text"
              id="prices"
              name="prices"
              value={formData.prices}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
              placeholder="e.g., $50, €45"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="note" className="block mb-2">Note </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Additional notes or instructions"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block mb-2">Step Image </label>
            <input
              type="file"
              id="image"
              name="image"
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
              Save Step
            </button>
         
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
                    <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={()=> router.push("/Les_Protocoles")}
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default page