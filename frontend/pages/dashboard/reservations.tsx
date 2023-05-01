import { DashboardLayout } from "@/components/Layout";
import { useMyReservations } from "@/lib/customSwr";
import { ReservationType } from "@/lib/types";
import { useState } from "react";

import { Table, THeader, TBody } from "@/components/Table";
import Selector from "@/components/Selector";

export default function Reservations() {
  const { reservations, isLoading } = useMyReservations();
  const [selectedGroup, setSelectedGroup] = useState("");

  if (isLoading) return <div>Loading ...</div>;

  const categories: string[] = Array.from(
    new Set(
      reservations?.map(
        (reservation: ReservationType) => reservation.group.name
      )
    )
  );

  const selectedReservations = reservations?.filter(
    (reservation: ReservationType) =>
      reservation.group.name.includes(selectedGroup)
  );

  return (
    <DashboardLayout>
      <div className="col-span-12 lg:col-span-4">
        <Selector
          state={selectedGroup}
          changeState={setSelectedGroup}
          options={categories}
          defaultOption={{ label: "All Groups", value: "" }}
        />
      </div>
      <div className="col-span-12 lg:col-span-8 flex flex-col">
        <Table>
          <THeader
            titles={[
              { title: "Group", size: "8/12" },
              { title: "Date", size: "2/12" },
              { title: "Price", size: "2/12" },
            ]}
          />
          <TBody>
            {selectedReservations?.map((reservation: ReservationType) => (
              <TableRow key={reservation.id} reservation={reservation} />
            ))}
          </TBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}

const TableRow = ({ reservation }: { reservation: ReservationType }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 capitalize">
      {reservation.group.name}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {reservation.date}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
        {reservation.price}€
      </span>
    </td>
  </tr>
);
