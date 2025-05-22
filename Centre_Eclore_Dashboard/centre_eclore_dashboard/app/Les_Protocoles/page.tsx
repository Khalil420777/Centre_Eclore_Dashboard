"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Sidebar from '../Sidebar/page';
import { PlusIcon } from 'lucide-react';

interface Protocole_data {
  idProtocole_types: string;
  title: string;
  description: string;
  image: string;
}
const page = () => {
    const [Protocole, setProtocole] = useState<Protocole_data[]>([]);

      const router = useRouter(); 

        const fetchprotocoles = async () => {
    try {
      const response = await fetch("http://localhost:3001/PROTOCOLE/prot_type");
      const data = await response.json();
      setProtocole(data);
      console.log(data);
      
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };
    useEffect(() => {
      fetchprotocoles();
    }, []);
  const handleaddprotocole = () => {
    router.push('/Ajouter_un_protocole'); // Navigate to a new page for adding treatments
  };

  return (
    <div className="flex">

         <Sidebar />
          <div className="p-6 w-full relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Les Protocoles</h1>
              <button 
                      onClick={handleaddprotocole}
                      className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 transition-colors"
                      title="Ajouter un traitement"
                    >
                      <PlusIcon size={24} />
                    </button>
       
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Protocole.map((Protocole) => (
            <div
              key={Protocole.idProtocole_types}
              className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer"
             
            >
              <img
                src={`http://localhost:3001/${Protocole.image}`}
                alt={Protocole.title}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-semibold">{Protocole.title}</h2>
              <p className="text-gray-600 text-sm">{Protocole.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page