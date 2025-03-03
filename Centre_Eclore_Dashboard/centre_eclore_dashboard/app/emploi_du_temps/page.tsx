"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/page";
import { useSearchParams } from "next/navigation";

interface Schedule {
  idtypes_schedule: number;
  start_time: string;
  end_time: string;
  types_idtypes: number;
  Contact_idContact: number;
}

const Page = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [newStartTime, setNewStartTime] = useState<string>("");
  const [newEndTime, setNewEndTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [contactId, setContactId] = useState<number | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null); // Track the schedule being edited
  const [updatedStartTime, setUpdatedStartTime] = useState<string>(""); // Updated start time
  const [updatedEndTime, setUpdatedEndTime] = useState<string>(""); // Updated end time

  const searchParams = useSearchParams();
  const idtypes = searchParams.get("id");
  const title = searchParams.get("title");

  useEffect(() => {
    if (idtypes) {
      fetchSchedule(Number(idtypes));
    }
  }, [idtypes]);

  const fetchSchedule = async (idtypes: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/SCHEDULE/${idtypes}`);
      if (!response.ok) {
        throw new Error("Échec de la récupération du calendrier");
      }
      const data = await response.json();
      setSchedule(data.data);
      // Assuming the API returns the contact ID in the response
      if (data.data.length > 0) {
        setContactId(data.data[0].Contact_idContact);
      }
    } catch (error) {
      console.log(error, "erreur lors de la récupération");
      setMessage("Erreur lors de la récupération du calendrier");
    } finally {
      setIsLoading(false);
    }
  };

  const createSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId) {
      setMessage("Erreur: Contact ID non trouvé");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/SCHEDULE/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_time: newStartTime,
          end_time: newEndTime,
          types_idtypes: Number(idtypes),
          Contact_idContact: contactId,
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de la création du calendrier");
      }

      // Clear inputs and refresh schedule
      setNewStartTime("");
      setNewEndTime("");
      setMessage("Horaire ajouté avec succès!");
      fetchSchedule(Number(idtypes));
    } catch (error) {
      console.log(error, "erreur lors de la création");
      setMessage("Erreur lors de la création du calendrier");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSchedule = async (idtypes_schedule: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/SCHEDULE/delete/${idtypes_schedule}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Échec de la suppression du calendrier");
      }

      // Refresh the schedule list after deletion
      setMessage("Horaire supprimé avec succès!");
      fetchSchedule(Number(idtypes));
    } catch (error) {
      console.log(error, "erreur lors de la suppression");
      setMessage("Erreur lors de la suppression du calendrier");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule) {
      setMessage("Erreur: Aucun horaire sélectionné pour la mise à jour");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/SCHEDULE/update/${editingSchedule.idtypes_schedule}`, {
        method: "PUT", // or "PATCH"
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_time: updatedStartTime,
          end_time: updatedEndTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du calendrier");
      }

      // Clear inputs and refresh schedule
      setEditingSchedule(null);
      setUpdatedStartTime("");
      setUpdatedEndTime("");
      setMessage("Horaire mis à jour avec succès!");
      fetchSchedule(Number(idtypes));
    } catch (error) {
      console.log(error, "erreur lors de la mise à jour");
      setMessage("Erreur lors de la mise à jour du calendrier");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Agenda de {title}</h1>
          
          {/* Create Schedule Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Ajouter un nouvel horaire</h2>
            <form onSubmit={createSchedule} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
              >
                {isLoading ? "Chargement..." : "Ajouter l'horaire"}
              </button>
              {message && (
                <p className={`mt-2 text-sm ${message.includes("Erreur") ? "text-red-600" : "text-green-600"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
          
          {/* Schedule Display */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Horaires existants</h2>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : schedule.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedule.map((sch) => (
                  <div 
                    key={sch.idtypes_schedule} 
                    className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg  className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-700">Début: <span className="font-medium">{sch.start_time}</span></p>
                      </div>
                      <div className="flex items-center">
                        <svg  className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-700">Fin: <span className="font-medium">{sch.end_time}</span></p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingSchedule(sch); // Set the schedule to edit
                            setUpdatedStartTime(sch.start_time); // Pre-fill the start time
                            setUpdatedEndTime(sch.end_time); // Pre-fill the end time
                          }}
                          className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => deleteSchedule(sch.idtypes_schedule)}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg text-gray-600">Aucun horaire trouvé</p>
                <p className="text-sm text-gray-500 mt-1">Créez votre premier horaire en utilisant le formulaire ci-dessus</p>
              </div>
            )}
          </div>

          {/* Update Schedule Form (Modal) */}
          {editingSchedule && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Modifier l'horaire</h2>
                <form onSubmit={updateSchedule} className="space-y-4">
                  <div>
                    <label htmlFor="updatedStartTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Nouvelle heure de début
                    </label>
                    <input
                      type="time"
                      id="updatedStartTime"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={updatedStartTime}
                      onChange={(e) => setUpdatedStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="updatedEndTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Nouvelle heure de fin
                    </label>
                    <input
                      type="time"
                      id="updatedEndTime"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={updatedEndTime}
                      onChange={(e) => setUpdatedEndTime(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                    >
                      {isLoading ? "Chargement..." : "Mettre à jour"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSchedule(null)}
                      className="w-full px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;