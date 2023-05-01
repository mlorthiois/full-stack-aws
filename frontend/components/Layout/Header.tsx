import Link from "next/link";

import { Coffee } from "@/components/icons";
import { NavBar } from "@/components/Layout";
import SectionContainer from "../SectionContainer";

export function Header() {
  return (
    <header className="bg-white py-3">
      <SectionContainer>
        <div className="flex justify-between">
          <Link href="/">
            <a className="font-semibold text-xl flex items-center space-x-3">
              <Coffee />
              <span className="hidden md:block">Coffee Break</span>
            </a>
          </Link>
          <NavBar />
        </div>
      </SectionContainer>
    </header>
  );
}
