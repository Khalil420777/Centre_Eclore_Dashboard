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

interface CancelledEvent {
  userName: string;
  New_title: string;
  formattedCancelTime: string;
  cancellationTimeframe: string;
  image: string;
  Event_date: string;
  Event_time: string;
}

const columns = [
  { name: "CLIENT", uid: "userName" },
  { name: "TIMEFRAME", uid: "timeframe" },
  { name: "EVENT", uid: "eventTitle" },
  { name: "DATE & TIME", uid: "eventDateTime" },
  { name: "CANCELLATION", uid: "cancellation" },
];

export default function EventCancelled() {
  const [cancelledEvents, setCancelledEvents] = useState<CancelledEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCancelledEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/NEWS/cancelled");
      if (!response.ok) throw new Error("Failed to fetch cancelled events");
      const data = await response.json();
      setCancelledEvents(data);
    } catch (error) {
      console.error("Error fetching cancelled events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelledEvents();
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

  const formatDateInFrench = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  };

  const formatEventDateTime = (date: string, time: string) => {
    try {
      const dateOnly = date.split("T")[0]; 
      const fullDateTime = new Date(`${dateOnly}T${time}`); 
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Intl.DateTimeFormat("fr-FR", options).format(fullDateTime);
    } catch (error) {
      return "Date invalide";
    }
  };
  
  
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Annulations des Événements
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table
              aria-label="Cancelled events table"
              className="min-w-full"
              classNames={{ wrapper: "shadow-none" }}
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
              <TableBody items={cancelledEvents}>
                {(item) => {
                  const formattedEventDateTime = formatEventDateTime(item.Event_date, item.Event_time);
                  return (
                    <TableRow key={`${item.userName}-${item.formattedCancelTime}`}>
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

                      <TableCell className="text-sm">{item.New_title}</TableCell>

                      <TableCell className="text-sm">
  <div>
    <div>{new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(item.Event_date))}</div>
    <div className="text-gray-500 text-xs">
      {item.Event_time.slice(0, 5)} 
    </div>
  </div>
</TableCell>

                      <TableCell className="text-sm">
                        {formatDateInFrench(item.formattedCancelTime)}
                      </TableCell>
                    </TableRow>
                  );
                }}
              </TableBody>
            </Table>
          )}

          {!isLoading && cancelledEvents.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Aucun événement annulé trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
