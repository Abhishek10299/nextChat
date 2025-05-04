"use client";
import React, { useEffect, useState } from "react";
import Conversation from "./Conversation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Conversations {
  _id: string;
  username: string;
  profilePicture: string;
}

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState("");
  const router = useRouter();

  const getFriends = async () => {
    try {
      const result = await axios.get("/api/users/get-friends");
      const friends = Array.isArray(result.data.message)
        ? result.data.message
        : [];
      setConversations(friends);
      console.log(result.data.message);
      setLoading(false);
    } catch (error) {
      console.error("Error in profile page", error);
      const axiosError = error as unknown as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const openFriendChat = (username: string) => {
    router.push(`/chat/${username}`);
    setSelectedConversation(username);
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <div className="flex flex-col overflow-y-auto h-full p-2">
      {loading ? (
        <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        conversations.map((conv) => (
          <div key={conv._id} onClick={() => openFriendChat(conv.username)}>
            <Conversation
              username={conv.username}
              profilePicture={conv.profilePicture}
              isSelected={conv.username === selectedConversation ? true : false}
            />
          </div>
        ))
      )}
    </div>
  );
}
