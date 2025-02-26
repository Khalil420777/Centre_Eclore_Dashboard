"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import Sidebar from '../Sidebar/page';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Button } from "@nextui-org/react";// Adjust import as necessary

interface ReservedNews {
  idUsers: number | null;
  name: string;
  image: string;
  Title: string;
  Description: string;
  Event_date: string;
  Event_time: string;
  reservation_type: string;
}

const Page = () => {
  const searchParams = useSearchParams();
  const idreservedevent = searchParams.get("id");

  const [Rnews, setRnews] = useState<ReservedNews[]>([]);

  useEffect(() => {
    if (idreservedevent) {
      fetchReservedNews();
    }
  }, [idreservedevent]);

  const fetchReservedNews = async () => {
    console.log("Fetching reserved news with ID:", idreservedevent);
    try {
      const response = await fetch(`http://localhost:3001/NEWS/${idreservedevent}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received data:", data);
      setRnews(data);
    } catch (error) {
      console.error("Error fetching reserved news:", error);
    }
  };

  // Helper function to format the date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-50 p-6 w-full">
        <h2 className="text-3xl font-semibold mb-4">Actualités réservées</h2>
        {Rnews.length > 0 ? (
          <Table aria-label="Reserved news table" className="min-w-full">
            <TableHeader>
              <TableColumn className="text-sm font-medium text-gray-700">Utilisateur</TableColumn>
              <TableColumn className="text-sm font-medium text-gray-700">Titre</TableColumn>
              <TableColumn className="text-sm font-medium text-gray-700">Description</TableColumn>
              <TableColumn className="text-sm font-medium text-gray-700">Date</TableColumn>
              <TableColumn className="text-sm font-medium text-gray-700">Heure</TableColumn>
              <TableColumn className="text-sm font-medium text-gray-700">Type de réservation</TableColumn>
            </TableHeader>
            <TableBody items={Rnews}>
              {(item) => (
                <TableRow key={item.idUsers} className="hover:bg-gray-50">
                  <TableCell>
                    <User
                      avatarProps={{
                        src: `http://localhost:3001/${item.image}`,
                        className: "w-10 h-10"
                      }}
                      name={item.name}
                      className="text-sm"
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">{item.Title}</TableCell>
                  <TableCell className="text-sm text-gray-700">{item.Description}</TableCell>
                  <TableCell className="text-sm text-gray-700">{formatDate(item.Event_date)}</TableCell>
                  <TableCell className="text-sm text-gray-700">{item.Event_time}</TableCell>
                  <TableCell className="text-sm text-gray-700">{item.reservation_type}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <p className="text-lg text-gray-700">Aucune actualité réservée trouvée.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
