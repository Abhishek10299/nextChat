"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

type Friend = {
  _id: string;
  username: string;
};

type UserData = {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  friends: Friend[];
};

export default function ProfilePage() {
  const params = useParams();
  const username = (params as { username: string }).username;

  const { data: session, status } = useSession();
  const user: User = session?.user as User;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const [buttonStatus, setButtonStatus] = useState<string>("Send Request");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/users/${username}`);
      setUserData(response.data.message);
      setLoading(false);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as unknown as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const fetchButtonStatus = async () => {
    if (!userData || !userData._id) return;
    setIsSwitchLoading(true);
    try {
      const response = await axios.post("/api/friends/request-status", {
        receiverid: userData._id,
      });
      
      const mapStatusToLabel = (status: string) => {
        switch (status) {
          case "pending":
            return "Request Sent";
          case "accepted":
            return "Friends";
          case "rejected":
            return "Send Request";
          default:
            return "Send Request";
        }
      };
      console.log(response.data.message);
      setButtonStatus(mapStatusToLabel(response.data.message));
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
    } finally {
      setIsSwitchLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [username]);

  useEffect(() => {
    if (userData) {
      fetchButtonStatus();
    }
  }, [userData]);

  const sendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!userData || !userData._id) {
      toast.error("User data not loaded.");
      return;
    }
    if (buttonStatus === "Send Request") {
      setIsSwitchLoading(true)

      try {
        console.log(userData._id);
        const response = await axios.post(`/api/friends/request`, {
          receiverId: userData._id,
        });
        toast.success(response.data.message);
        setLoading(false);
      } catch (error) {
        console.error("Error in sending friend request", error);
        const axiosError = error as unknown as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message;
        toast.error(errorMessage);
        setLoading(false);
      }
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white border-1 rounded-2xl p-8">
        {userData && (
          <>
            <div className="flex items-center space-x-6 mb-8">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={userData.profilePicture}
                  alt={userData.username}
                />
                <AvatarFallback>
                  {userData.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold capitalize">
                  {userData.username}
                </h2>
                <p className="text-gray-500">User Profile</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-700">
              <div>
                <p className="font-semibold">Email:</p>
                <p>{userData.email}</p>
              </div>

              <div>
                <p className="font-semibold">Total Friends:</p>
                <p>{userData.friends.length}</p>
              </div>

              <div className="md:col-span-2">
                <p className="font-semibold mb-2">Friends List:</p>
                <ul className="list-disc pl-6 space-y-1">
                  {userData.friends.map((friend) => (
                    <li key={friend._id}>{friend.username}</li>
                  ))}
                </ul>
              </div>
              {user?.username === username ? (
                ""
              ) : (
                <div>
                    <Button disabled={buttonStatus !== "Send Request"} onClick={sendRequest} variant="elevated">
                      {buttonStatus}
                    </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
