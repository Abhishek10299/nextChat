import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationProps {
  username: string;
  profilePicture: string;
  isSelected?: boolean;
}

export default function Conversation({
  username,
  profilePicture,
  isSelected = false,
}: ConversationProps) {
  return (
    <div
      className={`flex items-center  gap-4 p-3 rounded-lg cursor-pointer transition hover:bg-muted ${
        isSelected ? "bg-muted" : ""
      }`}
    >
      <Avatar>
        <AvatarImage src={profilePicture} alt={username} />
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col overflow-hidden">
        <span className="font-medium truncate">{username}</span>
        <span className="text-xs text-muted-foreground truncate">
          last message
        </span>
      </div>
    </div>
  );
}