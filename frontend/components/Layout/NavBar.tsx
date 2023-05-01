import Link from "next/link";

import { MainButton, SecondaryButton } from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { AvatarMenu } from "./AvatarMenu";

export function NavBar() {
  const { user } = useAuth();
  return (
    <nav className="flex items-center space-x-2.5 md:space-x-5 text-gray-500 text-sm">
      {user ? (
        <AvatarMenu />
      ) : (
        <>
          <SecondaryButton>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </SecondaryButton>
          <MainButton>
            <Link href="/register">
              <a>Sign Up</a>
            </Link>
          </MainButton>
        </>
      )}
    </nav>
  );
}
