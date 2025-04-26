import MessageContainer from "@/components/messages/MessageContainer";
import Sidebar from "@/components/sidebar/Sidebar";
import React from "react";

export default function page() {
  return (
    <div className="h-screen p-4 flex justify-center">
      <Sidebar />
      <MessageContainer selectedConversation="" username="" />
    </div>
  );
}
