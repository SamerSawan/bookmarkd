"use client";
import { IconSearch } from '@tabler/icons-react';
import React, { useState } from "react";

const Register: React.FC = () => {
  const [query, setQuery] = useState<string>("");

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-back-base text-secondary-weak px-20 py-10">
        <div className="relative w-full">
            <input 
                placeholder="Search by book title, author, isbn"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-back-overlay rounded-lg py-4 pl-12 focus:ring-primary focus:ring-2 outline-none placeholder-secondary-weak" 
            />
            <IconSearch 
                stroke={2} 
                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-secondary-weak" 
            />
        </div>
    </div>
  );
};

export default Register;
