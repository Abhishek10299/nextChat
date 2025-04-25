import Messages from "./Messages";
import MessageInput from "./MessageInput";
import React from "react";
import { MessageSquare } from "lucide-react";

export default function MessageContainer({ selectedConversation, username }) {
  if (!selectedConversation) return <NoChatSelected username={username} />;

  return (
    <div className="flex bg-white flex-col h-full">
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
    
const NoChatSelected = ({ username }) => {
    return (
      <div className="flex bg-white border-t rounded-r-2xl border-r border-b items-center justify-center w-1/2 h-full">
        <div className="px-4 text-center text-muted-foreground font-semibold flex flex-col items-center gap-2">
          <p>Welcome {username} </p>
          <p>Select a chat to start messaging</p>
          <MessageSquare  className="text-4xl md:text-6xl" />
        </div>
      </div>
    );
  };
  