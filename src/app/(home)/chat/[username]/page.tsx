"use client";

import MessageInput from "@/components/messages/MessageInput";
import Messages from "@/components/messages/Messages";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { LucideLoader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Friend {
  _id: string;
  username: string;
}

interface UserData {
  _id: string;
  username: string;
  email: string;
  publicKey: string;
  profilePicture: string;
  friends: Friend[];
}

export default function Page() {
  const params = useParams();
  const username = (params as { username: string }).username;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${username}`);
        setUserData(response.data.message);
        setLoading(false);
      } catch (error) {
        console.error("Error in profile page", error);
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage =
          axiosError.response?.data.message || "Failed to fetch user data.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  return (
    <div className="flex bg-white border-l-0 border rounded-r-xl flex-col h-full">
      <div className="border-b p-3 text-sm text-muted-foreground">
        <span className="font-semibold mr-1">To:</span>
        <span>
          {loading ? (
            <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            username
          )}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center space-x-4 m-4 p-4">
            <Skeleton className="h-12 w-12 bg-gray-400 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 bg-gray-400 w-[250px]" />
              <Skeleton className="h-4 bg-gray-400 w-[200px]" />
            </div>
          </div>
        ) : (
          <Messages
            receiverId={userData?._id || ""}
            publicKey={userData?.publicKey || ""}
          />
        )}
      </div>
      <MessageInput
        receiverId={userData?._id || ""}
        publicKey={userData?.publicKey || ""}
      />
    </div>
  );
}
