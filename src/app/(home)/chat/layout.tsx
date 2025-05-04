import Sidebar from "@/components/sidebar/Sidebar";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen p-4 flex justify-center">
      <Sidebar />
      {children }
    </div>
  );
} 