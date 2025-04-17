"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function NavBar() {
  const { data: session, status } = useSession();


    console.log("Auth status:", status);
    console.log("Session data:", session);

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-white font-bold text-xl">NextChat</div>
          </div>

          {status === "authenticated" ? (
            <div className="hidden md:block">
              <Link href="#" legacyBehavior passHref>
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
              </Link>
              <Link href="/about" legacyBehavior passHref>
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
              </Link>
              <Link href="" legacyBehavior passHref>
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</a>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/signin" legacyBehavior passHref>
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
