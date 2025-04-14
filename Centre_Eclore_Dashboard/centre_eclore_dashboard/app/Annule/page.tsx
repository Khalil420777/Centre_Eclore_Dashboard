"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import Sidebar from "../Sidebar/page";

interface CancelledReservation {
  userName: string;
  treatmentTitle: string;
  reservationDate: string;
  reservationTime: string;
  formattedCancelTime: string; // formatted cancellation date and time
  cancellationTimeframe: string;
  image: string;
}

const columns = [
  { name: "CLIENT", uid: "userName" },
  { name: "TIMEFRAME", uid: "timeframe" },
  { name: "TREATMENT", uid: "treatmentTitle" },
  { name: "APPOINTMENT", uid: "appointment" },
  { name: "CANCELLATION", uid: "cancellation" },
];

export default function CancelledReservations() {
  const [cancelledReservations, setCancelledReservations] = useState<CancelledReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCancelledReservations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/T_R/cancelled");
      if (!response.ok) throw new Error("Failed to fetch cancelled reservations");
      const data = await response.json();
      setCancelledReservations(data);
    } catch (error) {
      console.error("Error fetching cancelled reservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelledReservations();
  }, []);

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case "24h or less":
        return "danger";
      case "48h or less":
        return "warning";
      case "More than 48h":
        return "success";
      default:
        return "default";
    }
  };

  // Function to format the cancellation time to a French-friendly format
  const formatDateInFrench = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // "lundi"
      year: "numeric",
      month: "long", // "mars"
      day: "numeric",
      hour: "2-digit", // "23"
      minute: "2-digit", // "00"
    };
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  };

  // Function to format the appointment date and time
  const formatAppointment = (date: string, time: string) => {
    const formattedDate = new Date(date);
    const formattedTime = time
      .split(" - ")
      .map((timePart) => timePart.split(" ")[0]) // Extract the time (removes seconds)
      .join(" "); // Join with a space
    
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDateString = new Intl.DateTimeFormat("fr-FR", options).format(formattedDate);
    return { formattedDateString, formattedTime };
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Annulations des Réservations
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table
              aria-label="Cancelled reservations table"
              className="min-w-full"
              classNames={{
                wrapper: "shadow-none",
              }}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    className="text-sm font-medium text-gray-700"
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={cancelledReservations}>
                {(item) => {
                  const { formattedDateString, formattedTime } = formatAppointment(
                    item.reservationDate,
                    item.reservationTime
                  );
                  return (
                    <TableRow key={`${item.userName}-${item.reservationTime}`} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={`http://localhost:3001/${item.image}`}
                            alt="Profile"
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="text-sm font-medium">{item.userName}</div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Chip
                          color={getTimeframeColor(item.cancellationTimeframe) as any}
                          size="sm"
                          variant="flat"
                        >
                          {item.cancellationTimeframe}
                        </Chip>
                      </TableCell>

                      <TableCell className="text-sm">{item.treatmentTitle}</TableCell>

                      <TableCell className="text-sm">
                        <div>{formattedDateString}</div>
                        <div className="text-xs text-gray-500">{formattedTime}</div>
                      </TableCell>

                      <TableCell className="text-sm">
                        <div>{formatDateInFrench(item.formattedCancelTime)}</div>
                      </TableCell>
                    </TableRow>
                  );
                }}
              </TableBody>
            </Table>
          )}

          {!isLoading && cancelledReservations.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Aucune réservation annulée trouvée.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
