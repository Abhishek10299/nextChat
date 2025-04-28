import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";


export default function MessageInput() {
  return (
    <form className="flex items-center gap-2 border-t p-4">
      <Input type="text" placeholder="Type your message..." className="flex-1" />
      <Button className="h-12 w-12" type="submit" variant="ghost" size="icon">
        <Send className="text-lg" />
      </Button>
    </form>
  );
}