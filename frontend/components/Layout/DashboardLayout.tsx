import Link from "next/link";
import Head from "next/head";

import { useEffect } from "react";
import { TabBar } from "./TabBar";
import SectionContainer from "@/components/SectionContainer";
import { MainButton } from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { Avatar } from "@/components/Avatar";
import { useOwnedGroup } from "@/lib/customSwr";
import { useRouter } from "next/router";
import JoinGroup from "../JoinGroup";

export function DashboardLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const { ownedGroup } = useOwnedGroup();

  useEffect(() => {
    !user && router.push("/login");
  }, [user]);
  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard - Coffee Break</title>
      </Head>
      <TabBar />
      <section className="bg-white border-b border-gray-200 pt-10 pb-20">
        <SectionContainer>
          <div className="grid grid-cols-2 justify-between items-center gap-8 lg:gap-0">
            <div className="col-span-2 lg:col-span-1 flex items-center space-x-5 mx-auto lg:mx-0">
              <Avatar size="h-24 w-24" fontSize="4xl" />
              <p className="capitalize text-3xl font-semibold">
                {`${user.first_name} ${user.last_name}`}
              </p>
            </div>
            <div className="col-span-2 lg:col-span-1 text-center lg:text-right space-x-5 text-sm">
              <JoinGroup />
              {!ownedGroup?.name ? (
                <MainButton size="large">New Group</MainButton>
              ) : (
                <Link href="/dashboard/admin">
                  <a>
                    <MainButton size="large">See Group</MainButton>
                  </a>
                </Link>
              )}
            </div>
          </div>
        </SectionContainer>
      </section>
      <SectionContainer>
        <main className="-mt-9 grid grid-cols-12 lg:gap-12 pb-28 space-y-12 lg:space-y-0">
          {children}
        </main>
      </SectionContainer>
    </>
  );
}
