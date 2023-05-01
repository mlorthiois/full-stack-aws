import { useMyReservations } from "@/lib/customSwr";
import { ReservationType } from "@/lib/types";

export function DashboardReservations() {
  const { reservations, isLoading, isError } = useMyReservations();

  if (isError) return <div>failed to load</div>;

  return (
    <div className="col-span-12 lg:col-span-5">
      <h2 className="font-semibold tracking-tight mb-5">Last Reservations</h2>
      <ul className="divide-y">
        {isLoading &&
          [...Array(8)].map((idx) => (
            <li
              key={idx}
              className="rounded-lg animate-pulse bg-gray-300 py-4 my-4"
            />
          ))}
        {reservations &&
          reservations
            .slice(0, 8)
            .map((reservation: ReservationType) => (
              <DashboardReservation
                key={reservation.id}
                reservation={reservation}
              />
            ))}
      </ul>
    </div>
  );
}

function DashboardReservation({
  reservation,
}: {
  reservation: ReservationType;
}) {
  const date = new Date(reservation.date);
  const diffTime = Math.abs(Date.now() - Number(date));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24) - 1);
  return (
    <li className="flex justify-between py-3.5 items-baseline">
      <p className="capitalize space-x-1">
        <span>{reservation.group.name}</span>
        <span className="text-gray-500 text-sm">{`#${reservation.group.id}`}</span>
      </p>
      <span className="text-sm text-gray-500">
        {date.toDateString() === new Date().toDateString()
          ? "Today"
          : `${diffDays}d`}
      </span>
    </li>
  );
}
