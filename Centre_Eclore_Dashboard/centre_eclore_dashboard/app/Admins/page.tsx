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
import { Eye, EyeOff } from "lucide-react";
interface ADMINDATA {
  idContact?: number;
  fullname: string;
  Description: string;
  image: string;
}

interface ADMIN_CREDENTIALS {
  idAddmin?: number;
  name: string;
  email: string;
  password: string;
}

const columns = [
  { name: "ADMIN", uid: "fullname" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "ACTIONS", uid: "actions" },
];

const AdminPage = () => {
  const [admins, setAdmins] = useState<ADMINDATA[]>([]);
  const [formData, setFormData] = useState({
    fullname: "",
    Description: "",
    image: null as File | null,
  });
  const [ADMIN_CRED, setADMIN_CRED] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editingAdmin, setEditingAdmin] = useState<ADMINDATA | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("http://localhost:3001/CONTACT/");
      if (!response.ok) throw new Error("Failed to fetch admins");
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

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
    formDataToSend.append("fullname", formData.fullname);
    formDataToSend.append("Description", formData.Description);
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:3001/CONTACT/create", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.log("Server error response:", errorData);
        throw new Error(`Failed to create admin: ${errorData}`);
      }

      fetchAdmins();
      setFormData({ fullname: "", Description: "", image: null });
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  const handleDelete = async (idContact: number) => {
    const confirmDelete = window.confirm("Est-ce que tu es sûr pour supprimer cet admin?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3001/CONTACT/delete/${idContact}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.log("Server error response:", errorData);
          throw new Error(`Failed to delete admin: ${errorData}`);
        }

        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    }
  };

  const handleSave = async (idContact: number, formData: FormData) => {
    try {
      const response = await fetch(`http://localhost:3001/CONTACT/update/${idContact}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.log("Server error response:", errorData);
        throw new Error(`Failed to update admin: ${errorData}`);
      }

      fetchAdmins();
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  const EditModal = ({ admin, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      fullname: admin.fullname,
      Description: admin.Description,
      image: null as File | null,
    });

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
      formDataToSend.append("fullname", formData.fullname);
      formDataToSend.append("Description", formData.Description);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      } else {
        formDataToSend.append("existingImage", admin.image);
      }

      await onSave(admin.idContact, formDataToSend);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-6 w-96">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Edit Admin</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input
                name="fullname"
                placeholder="Enter admin name"
                variant="bordered"
                onChange={handleChange}
                value={formData.fullname}
                className="max-w-full"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Input
                name="Description"
                placeholder="Enter description"
                variant="bordered"
                onChange={handleChange}
                value={formData.Description}
                className="max-w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Current image: {admin.image ? admin.image.split('/').pop() : 'None'}
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" color="primary">
                Save
              </Button>
              <Button onClick={onClose} color="danger">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const createadminaccount = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/ADMIN/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ADMIN_CRED),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.log("Server error response:", errorData);
        throw new Error(`Failed to create admin account: ${errorData}`);
      }

      setADMIN_CRED({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Error creating admin account:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Liste Des Admins(Contact)
              </h2>
              <Table 
                aria-label="Admin table"
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
                <TableBody items={admins}>
                  {(item) => (
                    <TableRow key={item.idContact ?? item.fullname} className="hover:bg-gray-50">
                      <TableCell>
                        <User
                          avatarProps={{
                            src: `http://localhost:3001/${item.image}`,
                            className: "w-10 h-10"
                          }}
                          name={item.fullname}
                          className="text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {item.Description}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            color="primary"
                            onClick={() => {
                              setEditingAdmin(item);
                              setIsEditModalOpen(true);
                            }}
                          >
                            Modifier
                          </Button>
                          <Button 
                            size="sm" 
                            color="danger"
                            onClick={() => handleDelete(item.idContact || 0)} 
                          >
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="w-96">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Ajouter un nouveau Contact
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    name="fullname"
                    placeholder="Enter admin name"
                    variant="bordered"
                    onChange={handleChange}
                    value={formData.fullname}
                    className="max-w-full"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <Input
                    name="Description"
                    placeholder="Enter description"
                    variant="bordered"
                    onChange={handleChange}
                    value={formData.Description}
                    className="max-w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer transition-all duration-200"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  size="lg"
                >
                  Ajouter Admin
                </Button>
              </form>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                  Créer un nouveau compte d'ADMIN
                </h3>
                <form onSubmit={createadminaccount} className="space-y-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <Input
                      name="name"
                      placeholder="Enter admin name"
                      variant="bordered"
                      onChange={(e) => setADMIN_CRED({ ...ADMIN_CRED, name: e.target.value })}
                      value={ADMIN_CRED.name}
                      className="max-w-full"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      name="email"
                      placeholder="Enter admin email"
                      variant="bordered"
                      onChange={(e) => setADMIN_CRED({ ...ADMIN_CRED, email: e.target.value })}
                      value={ADMIN_CRED.email}
                      className="max-w-full"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <Input
            name="password"
            type={isVisible ? "text" : "password"} // Toggle input type
            placeholder="Enter admin password"
            variant="bordered"
            onChange={(e) => setADMIN_CRED({ ...ADMIN_CRED, password: e.target.value })}
            value={ADMIN_CRED.password}
            className="max-w-full"
            required
            endContent={
              <button
                type="button" // Prevent form submission
                onClick={() => setIsVisible(!isVisible)} // Toggle visibility
                className="focus:outline-none"
              >
                {isVisible ? (
                  <EyeOff className="text-gray-500 h-5 w-5" /> // Eye-off icon
                ) : (
                  <Eye className="text-gray-500 h-5 w-5" /> // Eye icon
                )}
              </button>
            }
          />
        </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                    size="lg"
                  >
                   Créer compte d'Admin
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && editingAdmin && (
        <EditModal
          admin={editingAdmin}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminPage;