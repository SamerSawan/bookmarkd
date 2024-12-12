"use client";
import Button from "@/components/util/Button";
import Link from "next/link";
import React, { useState } from "react";
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPass, setConfirmed] = useState<string>("");
    const [error, setError] = useState<string>("");

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

    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      router.push("/");
    } catch (err: any) {
      console.log(err.code)
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already in use.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError("Failed to register. Please try again.");
      }
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center bg-back text-secondary-weak px-20 py-10
    bg-[url('/background_art.jpg')] bg-cover bg-center"
    >
      <div className="flex flex-col self-center items-center bg-back-raised w-80 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-primary mb-6">Join Bookmarkd</h3>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-secondary-weak bg-fill rounded-md outline-none focus:ring-2 focus:ring-primary"
          />
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
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPass}
            onChange={(e) => setConfirmed(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-secondary-weak bg-fill rounded-md outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="mt-2">
            <Button Text={"Register"} onPress={handleRegister} />
          </div>
        <Link href="/login" className="text-primary text-sm hover:underline">
          Already have an account? Login here
        </Link>
      </div>
    </div>
  );
};

export default Register;
