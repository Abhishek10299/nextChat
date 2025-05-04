import React from "react";
import { Card } from "@/components/ui/card";

export default function Message({
  isOwnMessage = false,
  text,
}: {
  isOwnMessage: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-2`}
    >
      <Card
        className={`p-2 max-w-xs rounded-xl ${
          isOwnMessage ? "bg-primary text-white" : "bg-muted"
        }`}
      >
        {text}
      </Card>
    </div>
  );
}
