import {
  useGroupPlaces,
  useMyGroups,
  useMyReservations,
} from "@/lib/customSwr";
import { GroupType, ReservationType } from "@/lib/types";
import Card from "@/components/Card";
import { compareWithToday } from "@/lib/compareToday";
import { TakeABreak } from "./TakeABreak";

export function DashboardGroups() {
  const { groups, isLoading, isError } = useMyGroups();
  const { reservations } = useMyReservations();

  if (isError) return <div>failed to load</div>;

  if (isLoading)
    return (
      <div className="col-span-12 lg:col-span-7 space-y-7 bg-white shadow-md border border-gray-100 rounded-md animate-pulse" />
    );

  const groupIdsOfTodayReservations: Set<number> = new Set(
    reservations
      ?.slice(0, groups?.length)
      .map(
        (reservation: ReservationType) =>
          compareWithToday(reservation.date) && reservation.group.id
      )
  );

  return (
    <div className="col-span-12 lg:col-span-7 space-y-7">
      {groups.map((group: GroupType) => (
        <DashboardGroup
          key={group.group.id}
          group={group}
          ids={groupIdsOfTodayReservations}
        />
      ))}
    </div>
  );
}

interface DashboardGroupProps {
  group: GroupType;
  ids: Set<number>;
}

function DashboardGroup({ group, ids }: DashboardGroupProps) {
  const hour = new Date().toTimeString().slice(0, 8);
  const { places } = useGroupPlaces(group.group.id);
  return (
    <Card>
      <div className="lg:flex space-y-4 lg:space-y-0 justify-between px-6 py-12 items-center">
        <h3 className="capitalize font-semibold text-2xl">
          {group.group.name}
        </h3>
        {/* Not already reserved */}
        {
          <TakeABreak
            group={group}
            active={
              !ids.has(group.group.id) &&
              group.status === "approved" &&
              places > 0 &&
              hour < group.group.hour_limit
            }
          />
        }
      </div>
      <div className="flex justify-between p-6  text-gray-700 bg-gray-50 text-lg font-semibold">
        <p className="space-x-2 flex items-center">
          {group.status === "approved" ? (
            <>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
              <span className="capitalize">{group.status}</span>
            </>
          ) : (
            <>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="capitalize">{group.status}</span>
            </>
          )}
        </p>
        <p className="space-x-2 flex items-center">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{group.invoice}€</span>
        </p>
      </div>
    </Card>
  );
}
