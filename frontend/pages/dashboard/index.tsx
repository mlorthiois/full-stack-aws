import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/lib/auth";
import { DashboardGroups, DashboardReservations } from "@/components/Dashboard";
import { DashboardLayout } from "@/components/Layout";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    !user && router.push("/login");
  }, [user]);
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardGroups />
      <DashboardReservations />
    </DashboardLayout>
  );
}
