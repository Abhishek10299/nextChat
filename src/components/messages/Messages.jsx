import React from "react";
import Message from "./Message";

export default function Messages() {
  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full">
      <Message text="Hello!" />
      <Message text="Hey! How are you?" isOwnMessage />
    </div>
  );
}