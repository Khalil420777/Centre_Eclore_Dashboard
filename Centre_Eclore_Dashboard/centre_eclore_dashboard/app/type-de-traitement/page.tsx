"use client";
import React,{useState,useEffect} from 'react'
import { useSearchParams } from "next/navigation";
import Sidebar from '../Sidebar/page';

interface TYPEDATA{
    idtypes:string,
    title:string,
    description:string,
    image:string,
    Treatments_idTreatments:string
}
const page = () => {
const [type,settype]=useState<TYPEDATA[]>([])
    const searchParams = useSearchParams();
    const id = searchParams.get("id"); 
const fetchtype=async()=>{
    try{
        const response=await fetch(`http://localhost:3001/TYPES/${id}`)
        const data=await response.json()
        settype(data.data)
        console.log(data);
        
    }
    catch(error){
        console.error("Error fetching types:", error);
    }
}
useEffect(()=>{
    fetchtype()
},[])
    return(  
           <div className="flex">
        <Sidebar />
        <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Les Types Du Traitement</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {type.map((type) => (
            <div 
              key={type.idtypes} 
              className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer"
            >
              <img 
                src={type.image} 
                alt={type.title} 
                className="w-full h-40 object-cover rounded-md mb-2" 
              />
              <h2 className="text-lg font-semibold">{type.title}</h2>
              <p className="text-gray-600 text-sm">{type.description}</p>
            </div>
          ))}
        </div>
      </div>
         </div>
         )

}

export default page