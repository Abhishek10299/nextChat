"use client"
import { MessageSquare } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";


export default function page() {
  const { data: session} = useSession();
  const user:User = session?.user as User;
  const username = user?.username || "Guest";
  return (
    <div className="flex bg-white border-t rounded-r-2xl border-r border-b items-center justify-center w-1/2 h-full">
    <div className="px-4 text-center text-muted-foreground font-semibold flex flex-col items-center gap-2">
      <p>Welcome {username} </p>
      <p>Select a chat to start messaging</p>
      <MessageSquare className="text-4xl md:text-6xl" />
    </div>
  </div>
  )
}
