import { useOwnedGroupMembers } from "@/lib/customSwr";
import { MemberType } from "@/lib/types";
import ResetInvoice from "../ResetInvoice";
import ApproveMember from "../ApproveMember";
import { Table, THeader, TBody } from "../Table";

export const AdminMembers = () => {
  const { members, isLoading } = useOwnedGroupMembers();
  return (
    <Table>
      <THeader
        titles={[
          {
            title: "Name",
            size: "5/12",
          },
          {
            title: "Status",
            size: "2/12",
          },
          {
            title: "Invoice",
            size: "2/12",
          },
          {
            title: "Action",
            size: "2/12",
          },
        ]}
      />
      <TBody>
        {members?.map((member: MemberType) => (
          <TRowMember key={member.user.id} member={member} />
        ))}
        {isLoading &&
          [...Array(10).keys()].map((key) => (
            <tr
              key={key}
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

const TRowMember = ({ member }: { member: MemberType }) => (
  <tr>
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
            {member.user.first_name} {member.user.last_name}
          </div>
          <div className="text-sm text-gray-500">{member.user.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
          member.status === "approved"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {member.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">{member.invoice}€</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      {member.status !== "approved" ? (
        <ApproveMember member={member} />
      ) : (
        <ResetInvoice member={member} />
      )}
    </td>
  </tr>
);
