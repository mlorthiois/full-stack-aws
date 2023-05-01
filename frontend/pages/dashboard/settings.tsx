import Head from "next/head";

import { TabBar } from "@/components/Layout";
import SectionContainer from "@/components/SectionContainer";
import { ProfileForm, OwnedGroupForm } from "@/components/Settings";
import { useOwnedGroup } from "@/lib/customSwr";

export default function Settings() {
  const { ownedGroup } = useOwnedGroup();

  return (
    <>
      <Head>
        <title>Setting - Coffee Break</title>
      </Head>
      <TabBar />

      <SectionContainer>
        <ProfileForm />
        {ownedGroup?.id && <OwnedGroupForm />}
      </SectionContainer>
    </>
  );
}
