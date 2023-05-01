import { useOwnedGroupReservations } from "@/lib/customSwr";
import { AdminReservationType } from "@/lib/types";
import { Table, THeader, TBody } from "@/components/Table";

export const AdminReservations = () => {
  const { reservations, isLoading } = useOwnedGroupReservations();

  return (
    <Table>
      <THeader
        titles={[
          {
            title: "#",
            size: "1/12",
          },
          {
            title: "Name",
            size: "11/12",
          },
        ]}
      />
      <TBody>
        {reservations &&
          reservations.map((reservation: AdminReservationType, id: number) => (
            <TRowReservation
              key={reservation.id}
              id={id + 1}
              reservation={reservation}
            />
          ))}
        {isLoading &&
          [...Array(8)].map((idx) => (
            <tr
              key={idx}
              className="rounded-lg animate-pulse bg-gray-300 py-4 my-4 h-10"
            >
              <td className="px-6 py-4 whitespace-nowrap w-full bg-gray-300 animate-pulse" />
              <td className="px-6 py-4 whitespace-nowrap w-full bg-gray-300 animate-pulse" />
              <td className="px-6 py-4 whitespace-nowrap w-full bg-gray-300 animate-pulse" />
              <td className="px-6 py-4 whitespace-nowrap w-full bg-gray-300 animate-pulse" />
            </tr>
          ))}
      </TBody>
    </Table>
  );
};

const TRowReservation = ({
  reservation,
  id,
}: {
  reservation: AdminReservationType;
  id: number;
}) => (
  <tr key={reservation.id}>
    <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-sm">{id}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <img
            className="h-10 w-10 rounded-full"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
            alt=""
          />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900 capitalize">
            {reservation.user.first_name} {reservation.user.last_name}
          </div>
          <div className="text-sm text-gray-500">{reservation.user.email}</div>
        </div>
      </div>
    </td>
  </tr>
);
