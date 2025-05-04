import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";

export default function Sidebar() {
  return (
    <Card className="h-full rounded-r-none bg-white  shadow-sm flex flex-col">
      <CardContent className="p-4 pb-0">
        <SearchInput />
      </CardContent>
      <div className="border-t my-2" />
      <ScrollArea className="flex-1 ">
        <div className="p-4 ">
          <Conversations />
        </div>
      </ScrollArea>
    </Card>
  );
}
