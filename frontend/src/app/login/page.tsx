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
    <div className="flex flex-col min-h-screen items-center justify-center bg-back-base text-secondary-weak px-6 py-10
     bg-[url('/background_art.jpg')] bg-cover bg-center">

        <div className="flex flex-col self-center items-center bg-back-raised/95 backdrop-blur-sm border border-stroke-weak/50 w-96 p-8 rounded-2xl shadow-card-hover">
            <h1 className="text-3xl font-bold text-primary-light mb-2">Welcome Back</h1>
            <p className="text-secondary text-sm mb-8">Sign in to continue to Bookmarkd</p>

            <div className="w-full space-y-4">
              <div>
                <label className="text-secondary-weak text-sm font-medium mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-secondary-strong bg-back-overlay border border-stroke-weak/30
                             rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             transition-all duration-200"
                />
              </div>

              <div>
                <label className="text-secondary-weak text-sm font-medium mb-2 block">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-secondary-strong bg-back-overlay border border-stroke-weak/30
                             rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             transition-all duration-200"
                />
              </div>
            </div>

            {error && (
              <div className="w-full mt-4 p-3 bg-danger/10 border border-danger/30 rounded-lg">
                <p className="text-danger text-sm">
                  {error}
                </p>
              </div>
            )}

            <div className="mt-6 w-full">
              <Button Text="Sign In" onPress={handleLogin}/>
            </div>

            <div className="mt-6 text-center">
              <Link href="/register" className="text-primary hover:text-primary-light text-sm hover:underline transition-colors">
                Don&apos;t have an account? <span className="font-semibold">Create one here</span>
              </Link>
            </div>
      </div>
    </div>
  );
};

export default Login;
