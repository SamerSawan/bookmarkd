"use client";
import Button from "@/components/util/Button";
import React, { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("")

  const handleLogin = () => {
    // Placeholder for login logic
    alert(`Login with email: ${email}`);
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
            <Button Text={"Login"} onPress={handleLogin}/>
      </div>
    </div>
  );
};

export default Login;
