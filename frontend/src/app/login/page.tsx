"use client";
import Button from "@/components/util/Button";
import Link from "next/link";
import React, { useState } from "react";
import { auth } from "../../../firebase";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleLogin = () => {
    setError("")

    if (!email || !password) {
      setError("All fields are required.")
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      router.push("/")
    })
    .catch((error) => {
      setError(error.message);
    });
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-back text-secondary-weak px-20 py-10
     bg-[url('/background_art.jpg')] bg-cover bg-center">
        
        <div className="flex flex-col self-center items-center bg-back-raised w-80 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-6">Login</h3>
            <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-secondary-weak bg-fill rounded-md outline-none focus:ring-2 focus:ring-primary"
            />
            <input 
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-secondary-weak bg-fill rounded-md outline-none focus:ring-2 focus:ring-primary"
            />
            {error && (
              <p className="text-red-500 text-sm mb-4 self-start">
                {error}
              </p>
            )}
            <Link href="/register" className="text-primary text-sm hover:underline">Don&apos;t have an account? Create one here</Link>
            <div className="mt-2"><Button Text={"Login"} onPress={handleLogin}/></div>
      </div>
    </div>
  );
};

export default Login;
