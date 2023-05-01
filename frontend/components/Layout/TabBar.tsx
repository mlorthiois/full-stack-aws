import Link from "next/link";
import { useRouter } from "next/router";

import SectionContainer from "@/components/SectionContainer";
import { useOwnedGroup } from "@/lib/customSwr";

export const TabBar = () => {
  const router = useRouter();
  const { ownedGroup } = useOwnedGroup();

  const Tab = ({ title, link }: { title: string; link: string }) => (
    <Link href={link}>
      <a
        className={`border-b-2 border-transparent pb-2.5 pt-3 transition-colors duration-150 ${
          router.pathname == link
            ? " border-black text-black"
            : "text-gray-500 hover:text-gray-800 hover:border-gray-500"
        }`}
      >
        {title}
      </a>
    </Link>
  );

  return (
    <nav className="bg-white border-b sticky top-0 overflow-x-auto">
      <SectionContainer>
        <div className="flex space-x-8 text-gray-500 text-sm">
          <Tab title="Overview" link="/dashboard" />
          <Tab title="Reservations" link="/dashboard/reservations" />
          <Tab title="Groups" link="/dashboard/groups" />
          {ownedGroup?.name && <Tab title="Admin" link="/dashboard/admin" />}
          <Tab title="Settings" link="/dashboard/settings" />
        </div>
      </SectionContainer>
    </nav>
  );
};
