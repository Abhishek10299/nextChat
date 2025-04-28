"use client";
import React, { useEffect, useState } from "react";
import Conversation from "./Conversation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { LucideLoader2 } from "lucide-react";
import type { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { setUsername } from "@/store/selectedConversationSlice";
import { useSelector } from "react-redux";

interface Conversations {
  _id: string;
  username: string;
  profilePicture: string;
}

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversations[]>([]);
  const [loading, setLoading] = useState(true);
  const username = useSelector((state: RootState) => state.selectedConversation.username);

  const dispatch = useDispatch<AppDispatch>();

  const getFriends = async () => {
    try {
      const result = await axios.get("/api/users/get-friends");
      setConversations(result.data.message);
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

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <div className="flex flex-col overflow-y-auto h-full p-2">
      {loading ? (
        <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        conversations.map((conv) => (
          <div key={conv._id} onClick={() => dispatch(setUsername(conv.username))}>
            <Conversation
              username={conv.username}
              profilePicture={conv.profilePicture}
              isSelected={conv.username === username ? true : false}
            />
          </div>
        ))
      )}
    </div>
  );
}
