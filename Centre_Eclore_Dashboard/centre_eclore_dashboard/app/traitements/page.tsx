"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Sidebar from '../Sidebar/page';
import { PlusIcon, Edit2Icon } from 'lucide-react';

interface TraitementsDATA {
  idTreatments: string;
  title: string;
  Description: string;
  Image: string;
}

const Page = () => {
  const [Traitements, setTraitements] = useState<TraitementsDATA[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<TraitementsDATA | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    Description: '',
    image: null as File | null
  });
  const router = useRouter();

  const fetchTraitements = async () => {
    try {
      const response = await fetch("http://localhost:3001/TREATMENT/treatments");
      const data = await response.json();
      setTraitements(data);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };

  useEffect(() => {
    fetchTraitements();
  }, []);

  const handleNavigate = (id: string) => {
    router.push(`/type-de-traitement?id=${id}`);
  };

  const handleAddTreatment = () => {
    router.push('/Ajouter_un_traitement');
  };

  const handleEditClick = (e: React.MouseEvent, traitement: TraitementsDATA) => {
    e.stopPropagation(); // Prevent card navigation
    setEditingTreatment(traitement);
    setFormData({
      title: traitement.title,
      Description: traitement.Description,
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
    if (!editingTreatment) return;

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('Description', formData.Description);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch(
        `http://localhost:3001/TREATMENT/update/${editingTreatment.idTreatments}`,
        {
          method: 'PUT',
          body: formDataToSend,
        }
      );

      if (response.ok) {
        alert('Traitement mis à jour avec succès!');
        setIsEditModalOpen(false);
        fetchTraitements(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating treatment:', error);
      alert('Erreur lors de la mise à jour du traitement');
    }
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditingTreatment(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Les Traitements</h1>
          <button 
            onClick={handleAddTreatment}
            className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 transition-colors"
            title="Ajouter un traitement"
          >
            <PlusIcon size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Traitements.map((traitement) => (
            <div
              key={traitement.idTreatments}
              className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer relative group"
              onClick={() => handleNavigate(traitement.idTreatments)}
            >
              <button
                onClick={(e) => handleEditClick(e, traitement)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                title="Modifier"
              >
                <Edit2Icon size={18} className="text-blue-500" />
              </button>
              <img
                src={`http://localhost:3001/${traitement.Image}`}
                alt={traitement.title}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-semibold">{traitement.title}</h2>
              <p className="text-gray-600 text-sm">{traitement.Description}</p>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Modifier le Traitement</h2>
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
                    name="Description"
                    value={formData.Description}
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
                  {editingTreatment && (
                    <p className="text-sm text-gray-500 mt-1">Image actuelle: {editingTreatment.Image}</p>
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