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
  Input,
  Button,
} from "@nextui-org/react";
import Sidebar from "../Sidebar/page";

interface UserData {
  idUsers: number; // Add idUsers to the UserData interface
  name: string;
  image: string;
  balance: number;
}

const columns = [
  { name: "CLIENT", uid: "name" },
  { name: "BALANCE", uid: "balance" },
  { name: "ACTIONS", uid: "actions" },
];

export default function DashboardPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    balance: "",
    image: null as File | null,
  });

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:3001/USERS/users");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("password", formData.password.trim());
    formDataToSend.append("balance", formData.balance);
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:3001/USERS/create", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.log("Server error response:", errorData);
        throw new Error(`Failed to create user: ${errorData}`);
      }

      fetchClients();
      setFormData({ name: "", password: "", balance: "", image: null });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Delete Function
  const handleDelete = async (idUsers:number) => {
    const confirmdelete = window.confirm("Est-ce que tu es sûr pour supprimer ce client?");
    if (confirmdelete) {
      try {
        const response = await fetch(`http://localhost:3001/USERS/delete/${idUsers}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          const errorData = await response.text();
          console.log("Server error response:", errorData);
          throw new Error(`Failed to delete user: ${errorData}`);
        }
  
        // Refresh the user list after deletion
        fetchClients();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex gap-8">
          {/* Main Content - Table */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Liste Des Clients
              </h2>
              <Table 
                aria-label="User table"
                className="min-w-full"
                classNames={{
                  wrapper: "shadow-none"
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
                <TableBody items={users}>
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
                      <TableCell className="text-sm font-medium text-gray-700">
                        ${item.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" color="primary">
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            color="danger"
                            onClick={() => handleDelete(item.idUsers)} // Add onClick handler for delete
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Side Panel - Form */}
          <div className="w-96">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Ajouter un nouveau client
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <Input
                    name="name"
                    placeholder="Enter client name"
                    variant="bordered"
                    onChange={handleChange}
                    value={formData.name}
                    className="max-w-full"
                    classNames={{
                      inputWrapper: "h-12",
                      input: "placeholder:text-gray-400",
                    }}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    variant="bordered"
                    onChange={handleChange}
                    value={formData.password}
                    className="max-w-full"
                    classNames={{
                      inputWrapper: "h-12",
                      input: "placeholder:text-gray-400",
                    }}
                    required
                  />
                </div>

                {/* Balance Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Balance</label>
                  <Input
                    name="balance"
                    type="number"
                    placeholder="Enter initial balance"
                    variant="bordered"
                    onChange={handleChange}
                    value={formData.balance}
                    className="max-w-full"
                    classNames={{
                      inputWrapper: "h-12",
                      input: "placeholder:text-gray-400",
                    }}
                    required
                  />
                </div>

                {/* File Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-500 
                        file:mr-4 file:py-2.5 file:px-4 
                        file:rounded-lg file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-blue-50 file:text-blue-700 
                        hover:file:bg-blue-100 
                        file:cursor-pointer
                        transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  size="lg"
                >
                  Ajouter Client
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}