import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div  className="bg-[#F4F4F0]">{children}</div>;
}
