"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login"; // Add other paths if needed
  return (
    <>
      {!isAuthPage && <Sidebar />}
      {children}
    </>
  );
}
