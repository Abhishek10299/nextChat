import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Bell, LucideLoader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import FriendRequestNotification from "./FriendRequestNotification";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

interface Sender {
  _id: string;
  username: string;
  profilePicture: string;
}

interface NotificationItem {
  _id: string;
  sender: Sender;
  receiver: string;
  status: string;
}

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const fetchList = async () => {
    try {
      const result = await axios.get("/api/friends/list");
      setNotifications(result.data.message);
      setLoading(false);
    } catch (error) {
      console.error("Error in notification", error);
      const axiosError = error as unknown as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleAcceptAndReject = async (requestId: string, action: string) => {
    fetchList();
    setActionLoading(true);
    try {
      const result = await axios.post("/api/friends/respond", {
        requestId,
        action,
      });
      if (result.data.message === "accepted") {
        toast.success("Friend Request Accepted");
      } else {
        toast.success("Friend Request Rejected");
      }
      fetchList()
      setActionLoading(false);
    } catch (error) {
      console.error("Error in notification", error);
      const axiosError = error as unknown as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
      setActionLoading(false);
    }
  };
  console.log(isOpen);

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={notificationRef}
      className="relative m-2 flex items-center justify-center"
    >
      {/* Bell Icon */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-3 h-full flex items-center justify-center hover:bg-gray-100 rounded-xl cursor-pointer"
      >
        <Bell />
      </div>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute border top-full mt-2 right-0 w-80 bg-white shadow-lg rounded-md p-4 z-50 transition-all">
          {loading ? (
            <>
              <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" /> Please
              wait:
            </>
          ) : notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <FriendRequestNotification
                key={index}
                notificationId={notif._id}
                username={notif.sender.username}
                avatarUrl={notif.sender.profilePicture}
                onAccept={handleAcceptAndReject}
                onReject={handleAcceptAndReject}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">
              You have no notifications
            </p>
          )}
        </div>
      )}
    </div>
  );
}
