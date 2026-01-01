"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../Sidebar/page";
import { useRouter } from "next/navigation";
import { PlusIcon, Edit2Icon } from 'lucide-react';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<TYPEDATA | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null
  });
  
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

  const handleEditClick = (e: React.MouseEvent, typeData: TYPEDATA) => {
    e.stopPropagation(); // Prevent card navigation
    setEditingType(typeData);
    setFormData({
      title: typeData.title,
      description: typeData.description,
      image: null
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch(
        `http://localhost:3001/TYPES/update/${editingType.idtypes}`,
        {
          method: 'PUT',
          body: formDataToSend,
        }
      );

      if (response.ok) {
        alert('Type de traitement mis à jour avec succès!');
        setIsEditModalOpen(false);
        fetchType(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating treatment type:', error);
      alert('Erreur lors de la mise à jour du type de traitement');
    }
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditingType(null);
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
                className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer relative group"
                onClick={() => handleNavigate(t.idtypes, t.title)}
              >
                <button
                  onClick={(e) => handleEditClick(e, t)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 z-10"
                  title="Modifier"
                >
                  <Edit2Icon size={18} className="text-blue-500" />
                </button>
                
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
                    <p>⏳ Durée: {duration}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Modifier le Type de Traitement</h2>
              <form onSubmit={handleSubmitUpdate}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 h-24"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Image (optionnel)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                  {editingType && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">Image actuelle:</p>
                      <img 
                        src={`http://localhost:3001/${editingType.image}`} 
                        alt={editingType.title}
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Mettre à jour
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;