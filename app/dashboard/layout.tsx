"use client";

import { AuthProvider } from "@/lib/auth-context";
import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}
