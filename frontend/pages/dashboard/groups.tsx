import { DashboardLayout } from "@/components/Layout";
import { useMyGroups } from "@/lib/customSwr";

import { GroupType } from "@/lib/types";
import Card from "@/components/Card";

export default function Groups() {
  const { groups } = useMyGroups();
  return (
    <DashboardLayout>
      {groups?.map((group: GroupType) => (
        <GroupUI key={group.group.id} group={group} />
      ))}
    </DashboardLayout>
  );
}

const GroupUI = ({ group }: { group: GroupType }) => (
  <div className="col-span-12 md:col-span-6">
    <Card>
      <div className="border-b border-gray-200">
        <h2
          className="capitalize px-6 py-28 border-gray-100 font-bold text-3xl text-center rounded-t-md bg-black text-white"
          // style={{ backgroundColor: "#151515" }}
        >
          {group.group.name}
        </h2>
        <div className="px-6 py-4 flex">
          <div className="w-1/2 space-y-3">
            <p>Invoice:</p>
            <p className="text-3xl font-semibold text-center w-full flex items-center space-x-2">
              <svg
                className="w-8 h-8 inline-block"
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
          <div className="w-1/2 space-y-3">
            <p>Status:</p>
            {group.status === "approved" ? (
              <p className="text-2xl font-semibold flex w-full space-x-2 text-blue-500">
                <svg
                  className="w-8 h-8 inline-block"
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
              </p>
            ) : (
              <p className="text-2xl font-semibold flex w-full space-x-2 text-yellow-600">
                <svg
                  className="w-8 h-8 inline-block"
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
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-gray-50 p-6 text-gray-700">
        <span className="flex items-center space-x-1.5">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span> {group.group.hour_limit.slice(0, 5)}</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <svg
            className="w-6 h-6 inline-block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>{" "}
          <span>{group.group.price}€</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <svg
            className="w-6 h-6 inline-block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>{group.group.capacity}</span>
        </span>
      </div>
    </Card>
  </div>
);
