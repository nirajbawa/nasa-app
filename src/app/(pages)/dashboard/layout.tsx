import { Navbar06 } from "@/components/ui/DashboardNav";

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
