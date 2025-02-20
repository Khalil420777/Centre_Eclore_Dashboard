import React from 'react';
import Image from 'next/image';
import { IoPersonOutline, IoLockClosedOutline, IoMailOutline } from 'react-icons/io5';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#042652] p-6">
      <Image
        src="/eclore_logo.png"
        alt="Eclore Logo"
        width={130}
        height={100}
        className="mb-5"
      />
      <h1 className="text-white text-2xl text-center mb-2 font-inter">
        Connexion à l'Admin Dashboard
      </h1>
      <p className="text-white text-center mb-6">
        Accédez au tableau de bord administrateur avec vos<br /> identifiants sécurisés.
      </p>

      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center bg-white/20 rounded-3xl p-3">
          <IoPersonOutline className="text-white mr-3" size={20} />
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            className="flex-1 bg-transparent text-white outline-none placeholder-white"
          />
        </div>
        <div className="flex items-center bg-white/20 rounded-3xl p-3">
          <IoMailOutline className="text-white mr-3" size={20} />
          <input
            type="email"
            placeholder="Email"
            className="flex-1 bg-transparent text-white outline-none placeholder-white"
          />
        </div>
        <div className="flex items-center bg-white/20 rounded-3xl p-3">
          <IoLockClosedOutline className="text-white mr-3" size={20} />
          <input
            type="password"
            placeholder="Mot de passe"
            className="flex-1 bg-transparent text-white outline-none placeholder-white"
          />
        </div>
      </div>

      <button className="bg-[#33C8F9] text-white rounded-3xl py-3 px-6 mt-6 w-full max-w-md">
        Connexion
      </button>

     
    </div>
  );
};

export default Login;
