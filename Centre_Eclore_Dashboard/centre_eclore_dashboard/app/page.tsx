// home/page.tsx
"use client"
import ProtectedRoute from './Protectedroute/page'
import Sidebar from "./Sidebar/page"

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
     <Sidebar/>
      </div>
    </ProtectedRoute>
  );
}