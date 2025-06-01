"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../Sidebar/page'


interface Protocole_data {
  title: string;
  description: string;
  image: File | null;
}
const Protocolecreattion: React.FC = () => {
      const router = useRouter();
        const [Creatingprot, setCreatingprot] = useState<Omit<Protocole_data, 'idProtocole_types'>>({
          title: "",
          description: "",
          image: null
        });
         const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setCreatingprot((prev) => ({ ...prev, [name]: value }));
          };
        
          const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              setCreatingprot((prev) => ({ ...prev, image: e.target.files![0] }));
            }
          };
        
          const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            
            if (!Creatingprot.title || !Creatingprot.description) {
              alert("Please fill in all required fields");
              return;
            }
          
            const formDataToSend = new FormData();
            formDataToSend.append("title", Creatingprot.title);
            formDataToSend.append("description", Creatingprot.description);
            if (Creatingprot.image) formDataToSend.append("image", Creatingprot.image);
          
            try {
              const response = await fetch("http://localhost:3001/PROTOCOLE/create_prot", {
                method: "POST",
                body: formDataToSend,
              });
          
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
          
              const responseData = await response.json();
              console.log(responseData);
              
          
              if (!responseData.idProtocole_types) {
                throw new Error("No Protcole ID found in the response");
              }
          
              setCreatingprot({ 
                title: "", 
                description: "", 
                image: null 
              });
              router.push(`/R_steps_creation?id=${responseData.idProtocole_types}`);
          
          
            } catch (error) {
                console.log(error);
                
              console.error("Error adding Protcole:", error);
              alert(error instanceof Error ? error.message : "Failed to create treatment. Please try again.");
            }
          };
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Protocole</h1>
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">Protocole Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={Creatingprot.title}
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
              value={Creatingprot.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block mb-2">Protocole Image</label>
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
              Save Protcole
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

export default Protocolecreattion