"use client";
import { Poppins } from "next/font/google";
import Link from "next/link";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Navbarsidebar from "./Navbar-sidebar";
import { useState } from "react";
import { Bell, MenuIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import Notification from "@/components/notification/Notification";

const popins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  herf: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({ herf, children, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="outline"
      className={clsx(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
        isActive && "bg-black text-white hover:bg-black hover:text-white"
      )}
    >
      <Link href={herf}>{children}</Link>
    </Button>
  );
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const user: User = session?.user as User;

  const navbarItems = [
    { href: "/", children: "Home" },
    { href: `/profile/${user?.username}`, children: "Profile" },
    { href: "/chat", children: "Chat" },
  ];

  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <nav className="h-20 flex border-b justify-between font-medium bg-white">
      <Link href="/" className="pl-6 flex items-center">
        <span className={clsx("text-5xl font-semibold", popins.className)}>
          NextChat
        </span>
      </Link>
      <Navbarsidebar
        items={navbarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      {status === "authenticated" ? (
        <div className="items-center gap-4 hidden lg:flex">
          {navbarItems.map((item) => (
            <NavbarItem
              key={item.href}
              herf={item.href}
              isActive={pathname === item.href}
            >
              {item.children}
            </NavbarItem>
          ))}
        </div>
      ) : (
        ""
      )}
      {status === "authenticated" ? (
        <div className="hidden lg:flex items-center">
          <div> 
          <Notification/>
          </div>
          <Button
            asChild
            onClick={() => signOut()}
            variant="secondary"
            className="border-l border-t-0 border-b-0 border-r px-12 h-full rounded-none bg-black text-white hover:bg-blue-400 hover:text-black transition-colors text-lg"
          >
            <Link href="/signin">Log out</Link>
          </Button>
          
        </div>
      ) : (
        ""
      )}

      {status === "authenticated" ? (
        ""
      ) : (
        <div className="hidden lg:flex">
          <Button
            asChild
            variant="secondary"
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-blue-400 hover:text-black transition-colors text-lg"
          >
            <Link href="/signin">Log in</Link>
          </Button>

        </div>
      )}

      <div className="flex lg:hidden items-center justify-center">
        <Button
          variant="ghost"
          className="size-12 border-transparent bg-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>

        <div>
          <Notification/>
          </div>
      </div>
    </nav>
  );
}
