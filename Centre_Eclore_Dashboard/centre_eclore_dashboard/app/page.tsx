"use client"

import ProtectedRoute from './Protectedroute/page'
import Sidebar from "./Sidebar/page"
import Image from 'next/image';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <h1 className="text-4xl font-bold text-[#042652] mb-4">
            BIENVENUE
          </h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-6">
            sur le tableau de bord administrateur d'Eclore
          </h2>
          <h2 className="text-2l font-semibold text-gray-600 mb-6"> Gérez efficacement vos tâches et accédez aux fonctionnalités essentielles via la barre latérale.</h2>
          <div className="max-w-full mx-auto mb-8">
            <Image
              src="/Dashboard welcome.png"
              alt="Tableau de bord administrateur"
              width={950}
              height={500}
              className="transform -translate-y-80" // This lifts the image
            />
          </div>
    
        </div>
      </div>
    </ProtectedRoute>
  );
}
