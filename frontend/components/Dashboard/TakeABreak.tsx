import { SecondaryButton } from "@/components/Button";
import { useMyReservations } from "@/lib/customSwr";
import { useState } from "react";
import AlertModal from "@/components/AlertModal";
import { updateFetch } from "@/lib/updateFetch";
import { GroupType } from "@/lib/types";

import { mutate as globalMutate } from "swr";

export const TakeABreak = ({
  group,
  active,
}: {
  group: GroupType;
  active: boolean;
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const { reservations, mutate } = useMyReservations();

  const today = new Date().toISOString().slice(0, 10);

  const createReservation = async () => {
    await updateFetch(
      `/reservations/?group_id=${group.group.id}&date=${today}`,
      {},
      "POST"
    );

    const newReservation = {
      date: today,
      price: group.group.price,
      group,
    };
    mutate([...reservations, newReservation]);
    globalMutate("/user/groups");
  };

  return (
    <>
      <SecondaryButton disabled={!active} onClick={() => setShowDialog(true)}>
        <div className="flex items-center space-x-2">
          <span>Take a Break</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 inline-block"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
      </SecondaryButton>
      {showDialog && (
        <AlertModal
          isOpen={showDialog}
          close={() => setShowDialog(false)}
          action={() => {
            createReservation();
            setShowDialog(false);
          }}
          label="Reserve your break"
          description={`Are you sure you reserve your break? The price will be added to your invoice. This action cannot be
        undone.`}
          color="blue"
          svg={
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      )}
    </>
  );
};
