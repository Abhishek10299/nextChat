'use client'
import MessageInput from "@/components/messages/MessageInput";
import Messages from "@/components/messages/Messages";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

export default function page() {
  const selectedConversation = useSelector(
    (state: RootState) => state.selectedConversation.username
  );
  return (
    <div className="flex bg-white border-l-0 border rounded-r-xl flex-col h-full">
      <div className="border-b p-3 text-sm text-muted-foreground">
        <span className="font-semibold mr-1">To:</span>
        <span>{selectedConversation}</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Messages />
      </div>
      <MessageInput />
    </div>
  );
}
