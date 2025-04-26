import React from "react";
import Conversation from "./Conversation";

export default function Conversations() {
  // Example static data for preview
  const conversations = [
    {
      username: "Alice",
      lastMessage: "Hey! How are you?",
      profilePicture: "https://avatar.iran.liara.run/username?username=Alice",
    },
    {
      username: "Bob",
      lastMessage: "Wanna catch up later?",
      profilePicture: "https://avatar.iran.liara.run/username?username=Bob",
    },
  ];

  return (
    <div className="flex flex-col overflow-y-auto h-full p-2">
      {conversations.map((conv, index) => (
        <Conversation
          key={index}
          username={conv.username}
          lastMessage={conv.lastMessage}
          profilePicture={conv.profilePicture}
        />
      ))}
    </div>
  );
}
