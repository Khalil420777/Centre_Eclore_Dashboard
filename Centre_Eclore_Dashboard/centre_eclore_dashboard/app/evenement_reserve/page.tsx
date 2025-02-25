"use client"
import React from 'react'
import { useSearchParams } from "next/navigation";
const page = () => {
      const searchParams = useSearchParams();
      const id = searchParams.get("id");
  return (
    <div>page</div>
  )
}

export default page