import { MemberType } from "@/lib/types";
import { useState } from "react";
import AlertModal from "./AlertModal";
import { updateFetch } from "@/lib/updateFetch";
import { useOwnedGroupMembers } from "@/lib/customSwr";
import { SecondaryButton } from "./Button";

export default function ResetInvoice({ member }: { member: MemberType }) {
  const [showDialog, setShowDialog] = useState(false);
  const { members, mutate } = useOwnedGroupMembers();

  const resetInvoiceForMember = async () => {
    const updateMember = await updateFetch(
      `/admin/members/reset/${member.user.id}/`
    );

    const filteredMembers = members.filter(
      (mapMember: MemberType) => mapMember.user.id != member.user.id
    );
    mutate([...filteredMembers, updateMember]);
  };

  return (
    <>
      <SecondaryButton size="small" onClick={() => setShowDialog(true)}>
        Reset
      </SecondaryButton>
      {showDialog && (
        <AlertModal
          isOpen={showDialog}
          close={() => setShowDialog(false)}
          action={() => {
            resetInvoiceForMember();
            setShowDialog(false);
          }}
          label="Restore invoice"
          description={`Are you sure you want to reset ${member.user.first_name.charAt(0).toUpperCase() +
            member.user.first_name.slice(1)
            }'s invoice? Current invoice will be permanently removed. This action cannot be
          undone.`}
          color="yellow"
          svg={
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
        />
      )}
    </>
  );
}
