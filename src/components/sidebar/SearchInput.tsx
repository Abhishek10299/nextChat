import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchInput() {
  return (
    <form className="w-full">
      <div className="flex items-center gap-2 w-full">
        <Input
          type="text"
          placeholder="Search"
          className="flex-1"
        />
        <Button type="submit" size="icon" variant="secondary">
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
