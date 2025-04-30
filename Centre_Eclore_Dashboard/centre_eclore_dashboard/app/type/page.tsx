"use client"
import React, { useState } from 'react'
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation'
import Sidebar from '../Sidebar/page';

interface TypeItem {
  title: string;
  description: string;
  image: File | null;
}

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const idTreatments = searchParams.get("id");
  const router = useRouter();
  const [lastCreatedTypeId, setLastCreatedTypeId] = useState<string | null>(null);

  const [type, setType] = useState<TypeItem>({
    title: "",
    description: "",
    image: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setType((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setType((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type.title || !type.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", type.title);
      formData.append("description", type.description);
      if (type.image) formData.append("image", type.image);
      if (idTreatments) formData.append("Treatments_idTreatments", idTreatments);

      const response = await fetch("http://localhost:3001/TYPES/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (!responseData.idtypes) {
        throw new Error("No type ID found in the response");
      }

      // Store the last created type ID
      setLastCreatedTypeId(responseData.idtypes);
      
    
      setType({
        title: "",
        description: "",
        image: null
      });
     

    } catch (error) {
      console.error("Error adding type:", error);
      alert(error instanceof Error ? error.message : "Failed to create type. Please try again.");
    }
  };

  const handleContinue = () => {
    if (!lastCreatedTypeId) {
      alert("Please save at least one type before continuing");
      return;
    }
    router.push(`/creation_emploi?id=${lastCreatedTypeId}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Create Type</h1>
        
        <form onSubmit={handleSubmit} className="max-w-md border p-4 rounded mb-6">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">Type Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={type.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block mb-2">Description *</label>
            <textarea
              id="description"
              name="description"
              value={type.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block mb-2">Type Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
          >
            Save Type
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Continue
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          {lastCreatedTypeId ? (
            <p>Last created type ID: {lastCreatedTypeId}</p>
          ) : (
            <p>No types created yet. Save a type first.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;