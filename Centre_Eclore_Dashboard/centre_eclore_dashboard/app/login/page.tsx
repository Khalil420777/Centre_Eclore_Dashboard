"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoLockClosedOutline, IoMailOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/home"); // Redirect if already logged in
    }
  }, []);

  const handleLogin = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:3001/ADMIN/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', 
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set('token', data.token, { expires: 1, secure: true, sameSite: 'Strict' });
        router.push('/home'); // Redirect to home on successful login
      } else {
        setError(data.message || 'Échec de la connexion');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#042652] p-6">
      <Image src="/eclore_logo.png" alt="Eclore Logo" width={130} height={100} className="mb-5" />
      <h1 className="text-white text-2xl text-center mb-2 font-inter">Connexion à l'Admin Dashboard</h1>
      <p className="text-white text-center mb-6">Accédez au tableau de bord administrateur avec vos<br /> identifiants sécurisés.</p>

      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center bg-white/20 rounded-3xl p-3">
          <IoMailOutline className="text-white mr-3" size={20} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none placeholder-white"
          />
        </div>
        <div className="flex items-center bg-white/20 rounded-3xl p-3">
          <IoLockClosedOutline className="text-white mr-3" size={20} />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none placeholder-white"
          />
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button onClick={handleLogin} className="bg-[#33C8F9] text-white rounded-3xl py-3 px-6 mt-6 w-full max-w-md">
        Connexion
      </button>
    </div>
  );
};

export default Login;
