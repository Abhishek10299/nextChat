import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Navbarsidebar({ items, open, onOpenChange }: Props) {
  const { data: session, status } = useSession();

  const user: User = session?.user as User;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center">
            <SheetTitle>Menu</SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {status === "authenticated" ? (
            items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                onClick={() => onOpenChange(false)}
              >
                {item.children}
              </Link>
            ))
          ) : (
            <div className="border-t border-b">
              <Link
                href="/signin"
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              >
                Log in
              </Link>
            </div>
          )}
          {status === "authenticated" ? (
            <div className="border-t border-b">
              <Link
                onClick={() => signOut()}
                href="#"
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              >
                Log out
              </Link>
            </div>
          ) : (
            ""
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
