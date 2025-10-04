import { Navbar06 } from "@/components/ui/DashboardNav";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar06 />
      {children}
    </>
  );
}
