"use client";
import Button from "@/components/util/Button";
import Link from "next/link";
import React, { useState } from "react";
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useUser } from "../context/UserContext";

const Register: React.FC = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPass, setConfirmed] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { refreshShelves } = useUser()

  const handleRegister = async () => {
    setError("");

    
    if (!username || !email || !password || !confirmPass) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }
    console.log(auth, email, password)
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        
        const user = userCredential.user;
        const id = await user.getIdToken();
        console.log(id)
      const res = await axiosInstance.post("/users", {
        username,
        email,
        id
      })
      console.log(res)

      if (res.status == 201) {
        refreshShelves()
        router.push("/");
      }
      })
      .catch((err) => {
        console.log(err)
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("An error occurred during registration.");
        }
      });
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-back-base text-secondary-weak px-6 py-10
     bg-[url('/background_art.jpg')] bg-cover bg-center">

        <div className="flex flex-col self-center items-center bg-back-raised/95 backdrop-blur-sm border border-stroke-weak/50 w-96 p-8 rounded-2xl shadow-card-hover">
            <h1 className="text-3xl font-bold text-primary-light mb-2">Join Bookmarkd</h1>
            <p className="text-secondary text-sm mb-8">Create your account to start tracking your reading</p>

            <div className="w-full space-y-4">
              <div>
                <label className="text-secondary-weak text-sm font-medium mb-2 block">Username</label>
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 text-secondary-strong bg-back-overlay border border-stroke-weak/30
                             rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             transition-all duration-200"
                />
              </div>

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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-secondary-strong bg-back-overlay border border-stroke-weak/30
                             rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             transition-all duration-200"
                />
              </div>

              <div>
                <label className="text-secondary-weak text-sm font-medium mb-2 block">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPass}
                  onChange={(e) => setConfirmed(e.target.value)}
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
              <Button Text="Create Account" onPress={handleRegister}/>
            </div>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-primary hover:text-primary-light text-sm hover:underline transition-colors">
                Already have an account? <span className="font-semibold">Login here</span>
              </Link>
            </div>
      </div>
    </div>
  );
};

export default Register;
