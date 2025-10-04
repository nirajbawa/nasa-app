"use client";
import { Navbar06 } from "@/components/ui/DashboardNav";
import React from "react";
import ProtectedLayout from "@/components/ProtectedLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout>
      <Navbar06 />
      {children}
    </ProtectedLayout>
  );
}
