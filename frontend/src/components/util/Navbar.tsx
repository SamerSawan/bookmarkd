'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { IconLogout } from '@tabler/icons-react';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { useUser } from '@/app/context/UserContext';

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();

    const navLinks = [
        { href: '/shelves', label: 'Shelves' },
        { href: '/activity', label: 'Activity' },
        { href: '/search', label: 'Search' },
    ];

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="flex justify-between items-center self-center w-full">
            <div>
                <Link href="/" className="font-bold text-2xl md:text-3xl text-primary hover:text-primary-light transition-colors">
                    BOOKMARKD
                </Link>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
                {/* Main Navigation Links */}
                <div className="flex flex-row gap-2 md:gap-4 text-base md:text-xl">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 md:px-4 py-2 rounded-lg transition-all duration-200
                                    ${isActive
                                        ? 'text-primary-light bg-back-overlay font-semibold'
                                        : 'text-primary hover:text-primary-light hover:bg-back-overlay/50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Profile Avatar */}
                {user?.username && (
                    <div
                        onClick={() => router.push(`/${user.username}`)}
                        className="cursor-pointer"
                    >
                        <Image
                            src={"/default-avatar.jpg"}
                            alt={`${user.username}'s avatar`}
                            width={40}
                            height={40}
                            className="rounded-full object-cover aspect-square hover:ring-2 hover:ring-primary transition-all"
                        />
                    </div>
                )}

                {/* Sign Out Button */}
                <button
                    onClick={handleSignOut}
                    className="bg-primary text-secondary-dark font-semibold p-2 md:px-4 md:py-2.5 rounded-lg
                               hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20
                               active:scale-95 transition-all duration-200"
                    title="Sign out"
                >
                    <IconLogout stroke={2} size={20} />
                </button>
            </div>
        </div>
    );
};

export default Navbar;