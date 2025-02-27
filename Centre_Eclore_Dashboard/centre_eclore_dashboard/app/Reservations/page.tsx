"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/page';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Button } from "@nextui-org/react";

interface Reservation {
  reservationId: number;
  userName: string;
  userImage: string;
  treatmentTitle: string;
  reservationDate: string;
  reservationTime: string;
 
}

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    // Fetch reservations data from the API
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:3001/t_R/reservations');
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const data = await response.json();
        data.sort((a: Reservation, b: Reservation) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime());
        
        setReservations(data);
      } catch (error: any) {
        setError(error.message);
      } 
    };
    
    fetchReservations();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const deleteReservation = async (reservationId: number) => {
    const isConfirmed = window.confirm("Est-ce que tu es sûr de vouloir supprimer cette réservation ?");
    if (!isConfirmed) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3001/t_R/Cancel/${reservationId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }
      
      // Remove the deleted reservation from the state
   
    
      
    } catch (error: any) {
      console.error('Error deleting reservation:', error.message);
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
        <h2 className="text-3xl font-semibold mb-4">Reservations</h2>
        <Table aria-label="Reserved news table" className="min-w-full">
          <TableHeader>
            <TableColumn className="text-sm font-medium text-gray-700">Utilisateur</TableColumn>
            <TableColumn className="text-sm font-medium text-gray-700">Titre</TableColumn>
            <TableColumn className="text-sm font-medium text-gray-700">Date</TableColumn>
            <TableColumn className="text-sm font-medium text-gray-700">Heure</TableColumn>
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
                <TableCell className="text-sm text-gray-700">{reservation.treatmentTitle}</TableCell>
                <TableCell className="text-sm text-gray-700">{formatDate(reservation.reservationDate)}</TableCell>
                <TableCell className="text-sm text-gray-700">{reservation.reservationTime}</TableCell>
                <TableCell>
                  <Button
                    color="danger"
                    size="sm"
                    isLoading={isDeleting}
                    onPress={() => deleteReservation(reservation.reservationId)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Reservations;