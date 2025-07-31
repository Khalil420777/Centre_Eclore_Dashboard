"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/page';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Button, Chip } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";

interface Reservation_Pr {
  reservationId: number;
  userName: string;
  userImage: string;
  protocolTitle: string;
  reservationDate: string;
  reservationTime: string;
  reservationStatus: string;
  stepNumber: number;
  stepTitle: string;
  nextStepTitle: string;
  nextStepNumber: number;
}

const page = () => {
  const [reservations, setReservations] = useState<Reservation_Pr[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const idcontact = searchParams.get("id");
  
  useEffect(() => {
    // Fetch protocol reservations data from the API
    const fetchReservations = async () => {
      try {
        const response = await fetch(`http://localhost:3001/PROTOCOLE/worker_protocol_reservations/${idcontact}`);
        if (!response.ok) {
          throw new Error('Failed to fetch protocol reservations');
        }
        const data = await response.json();
        data.sort((a: Reservation_Pr, b: Reservation_Pr) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime());
        
        setReservations(data);
      } catch (error: any) {
        setError(error.message);
      } 
    };
    
    fetchReservations();
  }, [idcontact]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const updateStatusToComplete = async (reservationId: number) => {
    const isConfirmed = window.confirm("Est-ce que tu es sûr de vouloir marquer cette réservation comme terminée ?");
    if (!isConfirmed) return;
    
    setIsUpdating(reservationId);
    try {
      const response = await fetch(`http://localhost:3001/PROTOCOLE/steps/${reservationId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },

      });
      
      if (!response.ok) {
        throw new Error('Failed to update protocol reservation status');
      }
      
      // Update the reservation status in the state
      setReservations(prev => 
        prev.map(reservation => 
          reservation.reservationId === reservationId
            ? { ...reservation, reservationStatus: 'completed' }
            : reservation
        )
      );
      
    } catch (error: any) {
      console.error('Error updating protocol reservation status:', error.message);
      alert('Erreur lors de la mise à jour du statut de la réservation');
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteReservation = async (reservationId: number) => {
    const isConfirmed = window.confirm("Est-ce que tu es sûr de vouloir supprimer cette réservation de protocole ?");
    if (!isConfirmed) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3001/PROTOCOLE/delete/${reservationId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete protocol reservation');
      }
      
      // Remove the deleted reservation from the state
      setReservations(prev => prev.filter(reservation => reservation.reservationId !== reservationId));
      
    } catch (error: any) {
      console.error('Error deleting protocol reservation:', error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-50 p-6 w-full">
        <h2 className="text-3xl font-semibold mb-4">Réservations de Protocoles</h2>
        <Table aria-label="Protocol reservations table" className="min-w-full">
          <TableHeader>
            <TableColumn className="text-sm font-medium text-gray-700">Utilisateur</TableColumn>
            <TableColumn className="text-sm font-medium text-gray-700">Protocole</TableColumn>
            <TableColumn className="text-sm font-medium text-gray-700">Étape Actuelle</TableColumn>
            <TableColumn className="text-sm font-medium text-gray-700">Prochaine Étape</TableColumn>
            <TableColumn className="text-sm font-medium text-gray-700">Date</TableColumn>
            <TableColumn className="text-sm font-medium text-gray-700">Heure</TableColumn>
            <TableColumn className="text-sm font-medium text-gray-700">Statut</TableColumn>
            <TableColumn className="text-sm font-medium text-gray-700">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.reservationId} className="hover:bg-gray-50">
                <TableCell>
                  <User
                    avatarProps={{
                      src: `http://localhost:3001/${reservation.userImage}`,
                      className: "w-10 h-10"
                    }}
                    name={reservation.userName}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell className="text-sm text-gray-700">{reservation.protocolTitle}</TableCell>
                <TableCell className="text-sm text-gray-700">
                  <div className="flex flex-col">
                    <span className="font-medium">Étape {reservation.stepNumber}</span>
                    <span className="text-xs text-gray-500">{reservation.stepTitle}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {reservation.nextStepTitle ? (
                    <div className="flex flex-col">
                      <span className="font-medium">Étape {reservation.nextStepNumber}</span>
                      <span className="text-xs text-gray-500">{reservation.nextStepTitle}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Dernière étape</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-700">{formatDate(reservation.reservationDate)}</TableCell>
                <TableCell className="text-sm text-gray-700">{reservation.reservationTime}</TableCell>
                <TableCell>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(reservation.reservationStatus)}`}>
                    {getStatusText(reservation.reservationStatus)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {reservation.reservationStatus === 'pending' && (
                      <Button
                        color="success"
                        size="sm"
                        isLoading={isUpdating === reservation.reservationId}
                        onPress={() => updateStatusToComplete(reservation.reservationId)}
                      >
                        Marquer terminé
                      </Button>
                    )}
                    <Button
                      color="danger"
                      size="sm"
                      isLoading={isDeleting}
                      onPress={() => deleteReservation(reservation.reservationId)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {reservations.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            Aucune réservation de protocole trouvée
          </div>
        )}
      </div>
    </div>
  );
};

export default page;