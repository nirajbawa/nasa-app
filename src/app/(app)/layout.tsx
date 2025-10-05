import AppNav from "@/components/AppNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppNav />
      {children}
    </>
  );
}
