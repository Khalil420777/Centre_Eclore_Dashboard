"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
} from "@nextui-org/react";
import Sidebar from "../Sidebar/page";

interface UserData {
  name: string;
  image: string;
  balance: number;
}

const columns = [
  { name: "NAME", uid: "name" },
  { name: "BALANCE", uid: "balance" },
  { name: "ACTIONS", uid: "actions" },
];

const EditIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 20 20"
    width="1em"
    {...props}
  >
    <path
      d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
    <path
      d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
    <path
      d="M2.5 18.3333H17.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
  </svg>
);

const DeleteIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 20 20"
    width="1em"
    {...props}
  >
    <path
      d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M8.60834 13.75H11.3833"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M7.91669 10.4167H12.0834"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

const Page: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:3001/Users/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEdit = (user: UserData) => {
    console.log("Edit user:", user);
    // Add your edit logic here
  };

  const handleDelete = (user: UserData) => {
    console.log("Delete user:", user);
    // Add your delete logic here
  };

  const renderCell = (user: UserData, columnKey: keyof UserData | "actions") => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: `http://localhost:3001/${user.image.replace(/\\/g, "/")}`,
              className: "w-8 h-8"
            }}
            name={user.name}
            className="text-sm text-gray-200"
          >
            {user.name}
          </User>
        );
      case "balance":
        return (
          <div className="flex flex-col">
            <p className="text-sm text-gray-200">${user.balance.toLocaleString()}</p>
          </div>
        );
      case "actions":
        return (
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-1">Edit</span>
              <Tooltip content="Edit user">
                <span
                  className="text-base text-green-400 cursor-pointer active:opacity-50"
                  onClick={() => handleEdit(user)}
                >
                  <EditIcon />
                </span>
              </Tooltip>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-1">Delete</span>
              <Tooltip color="danger" content="Delete user">
                <span
                  className="text-base text-red-400 cursor-pointer active:opacity-50"
                  onClick={() => handleDelete(user)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <h2 className="text-xl font-bold mb-4 text-black">Nos Clients</h2>
        <div className="bg-gray-800 rounded-lg p-4 shadow-md max-w-xl"> {/* Made box smaller and light black */}
          <Table 
            aria-label="User table with custom cells" 
            aria-labelledby="tableLabel"
            className="min-w-fit"
            classNames={{
              base: "max-w-xl", // Made table even smaller
              th: "text-sm py-2 text-gray-300",
              td: "py-2",
              wrapper: "bg-gray-800",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={users}>
              {(item) => (
                <TableRow key={item.name}>
                  {(columnKey) => (
                    <TableCell>
                      {renderCell(item, columnKey as keyof UserData | "actions")}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;