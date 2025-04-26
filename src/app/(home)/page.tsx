"use client"
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";


export default function Home() {
  const { data: session, status } = useSession();
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 text-center px-4">
    <div className="max-w-2xl">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
        Welcome to <span className="text-indigo-600">NextChat</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8">
        Connect, chat, and build meaningful conversations with your friends — all in real time.
      </p>
      <Button asChild className="text-lg px-6 py-4">
        <Link href={status==="authenticated"?"/chat":"/signin"}>Get Started</Link>
      </Button>
    </div>
  </section>
  );
}
