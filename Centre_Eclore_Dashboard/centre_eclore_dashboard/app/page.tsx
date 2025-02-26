"use client";

import ProtectedRoute from './Protectedroute/page';
import Sidebar from "./Sidebar/page";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
       <div className="flex-1 p-8 overflow-hidden h-screen">
  <h1 className="text-4xl font-bold text-[#042652] mb-4">BIENVENUE</h1>
  <h2 className="text-2xl font-semibold text-gray-600 mb-6">
    sur le tableau de bord administrateur d'Eclore
  </h2>
  <h2 className="text-2l font-semibold text-gray-600 mb-6">
    Gérez efficacement vos tâches et accédez aux fonctionnalités essentielles via la barre latérale.
  </h2>
  <div className="max-w-full mx-auto mb-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
    <img
      src="/Dashboard welcome.png"
      alt="Tableau de bord administrateur"
      className="w-[950px] h-auto max-h-[80vh] object-cover"
    />
  </div>
</div>

      </div>
    </ProtectedRoute>
  );
}
