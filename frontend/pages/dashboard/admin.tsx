import { DashboardLayout } from "@/components/Layout";
import { useState } from "react";
import Selector from "@/components/Selector";
import { AdminMembers } from "@/components/Admin/AdminMembers";
import { AdminReservations } from "@/components/Admin";

export default function Admin() {
  const [content, setContent] = useState("today reservations");

  return (
    <DashboardLayout>
      <div className="col-span-12 lg:col-span-4">
        <Selector
          description="Show"
          state={content}
          changeState={setContent}
          options={["today reservations", "group members"]}
        />
      </div>
      <div className="col-span-12 lg:col-span-8">
        {content === "today reservations" ? (
          <AdminReservations />
        ) : (
          <AdminMembers />
        )}
      </div>
    </DashboardLayout>
  );
}
