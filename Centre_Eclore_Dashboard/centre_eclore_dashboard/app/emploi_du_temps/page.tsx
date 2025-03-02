"use client"
import React,{useState,useEffect} from 'react'
import Sidebar from '../Sidebar/page';
import { useSearchParams } from "next/navigation";
const page = () => {
      const searchParams = useSearchParams();
      const idtypes = searchParams.get("id");
  return (
    <div>
        <Sidebar/>
    </div>
  )
}

export default page