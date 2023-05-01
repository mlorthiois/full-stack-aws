import { MemberType } from "@/lib/types";
import { useState } from "react";
import AlertModal from "./AlertModal";
import { updateFetch } from "@/lib/updateFetch";
import { useOwnedGroupMembers } from "@/lib/customSwr";
import { SecondaryButton } from "./Button";

export default function ApproveMember({ member }: { member: MemberType }) {
  const [showDialog, setShowDialog] = useState(false);
  const { members, mutate } = useOwnedGroupMembers();

  const approveMember = async () => {
    const updateMember = await updateFetch(`/admin/members/approve/${member.user.id}/`);

    const filteredMembers = members.filter(
      (mapMember: MemberType) => mapMember.user.id != member.user.id
    );
    mutate([...filteredMembers, updateMember]);
  };

  return (
    <>
      <SecondaryButton size="small" onClick={() => setShowDialog(true)}>
        Approve
      </SecondaryButton>
        howDialog && (
        <AlertModal
          isOpen={showDialog}
          close={() => setShowDialog(false)}
          action={() => {
            approveMember();
            setShowDialog(false);
          }}
          label="Approve member"
          description={`Are you sure you want to approve ${member.user.first_name.charAt(0).toUpperCase() +
            member.user.first_name.slice(1)
            }? User will be able to take reservations on this group. This action cannot be
          undone.`}
          color="green"
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
}
