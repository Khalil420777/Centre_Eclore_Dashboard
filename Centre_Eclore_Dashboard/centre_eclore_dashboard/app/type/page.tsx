"use client"
import React,{useState,useEffect} from 'react'
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation'
import Sidebar from '../Sidebar/page';

const page: React.FC = () => {
    const searchParams = useSearchParams();
    const idTreatments = searchParams.get("id");
  const router = useRouter();

  const [creatingType, setCreatingType] = useState({
    title: "",
    description: "",
    image: null
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreatingType((prev) => ({ ...prev, [name]: value }));
  };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setCreatingType((prev) => ({ ...prev, image: e.target.files![0] }));
      }
    };
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!creatingType.title || !creatingType.description) {
          alert("Please fill in all required fields");
          return;
        }
      
        const formDataToSend = new FormData();
        formDataToSend.append("title", creatingType.title);
        formDataToSend.append("description", creatingType.description);
        if (creatingType.image) formDataToSend.append("image", creatingType.image);
        if (idTreatments) formDataToSend.append("Treatments_idTreatments", idTreatments);
      
        try {
          const response = await fetch("http://localhost:3001/TYPES/create", {
            method: "POST",
            body: formDataToSend,
          
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const responseData = await response.json();
      
          if (!responseData.idtypes) {
            throw new Error("No treatment ID found in the response");
          }
      
          setCreatingType({ 
            title: "", 
            description: "", 
            image: null 
          });
           router.push(`/creation_emploi?id=${responseData.idtypes}`);
      
      
        } catch (error) {
          console.error("Error adding type:", error);
          alert(error instanceof Error ? error.message : "Failed to create treatment. Please try again.");
        }
      };
      return (
        <div className="flex">
          <Sidebar />
          <div className="flex-grow p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Type</h1>
            <form onSubmit={handleSubmit} className="max-w-md">
              <div className="mb-4">
                <label htmlFor="title" className="block mb-2">Type Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={creatingType.title}
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
                  value={creatingType.description}
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
    
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Type
                </button>
     
              </div>
            </form>
          </div>
        </div>
      )
}

export default page