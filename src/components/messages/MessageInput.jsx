import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";


export default function MessageInput() {
  return (
    <form className="flex gap-2 border-t p-4">
      <Input type="text" placeholder="Type your message..." className="flex-1" />
      <Button type="submit" variant="default" size="icon">
        <Send className="text-lg" />
      </Button>
    </form>
  );
}