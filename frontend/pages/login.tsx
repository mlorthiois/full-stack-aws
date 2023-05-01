import SectionContainer from "@/components/SectionContainer";
import { useEffect, useState } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/lib/auth";
import { Error } from "@/components/icons";
import Link from "next/link";

export default function Login() {
  const { user, signIn, error, setError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (user) {
    router.push("/dashboard");
    return null;
  }

  const handlerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <SectionContainer>
      <div className="mt-20 md:mt-32 mb-5 text-center">Logo</div>
      <h1 className="font-extrabold text-4xl text-center">Log in to Coffee</h1>
      <div className="bg-white mt-12 shadow max-w-sm mx-auto p-8 rounded-md">
        <form onSubmit={handlerSubmit}>
          <label>
            <span className="text-sm text-gray-500 block mb-1 font-medium">
              Email address
            </span>
            <input
              className="border-gray-300 border rounded-md py-1 px-3 w-full mb-6"
              type="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            <span className="text-sm text-gray-500 block mb-1 font-medium">
              Password
            </span>
            <input
              className="border-gray-300 border rounded-md py-1 px-3 w-full mb-6"
              type="password"
              name="password"
              autoComplete="on"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            <div className="flex items-center justify-between text-gray-700 text-sm mb-6">
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="h-3.5 w-3.5" />
                <span className="ml-2">Remember me</span>
              </div>
              <Link href="/register">
                <a className="font-semibold">{"Don't have account?"}</a>
              </Link>
            </div>
          </label>
          <input
            className="bg-black text-white w-full py-2 px-3 rounded-md cursor-pointer"
            type="submit"
            value="Sign In"
          />
        </form>
      </div>

      {error && (
        <div
          className="absolute right-5 top-20 max-w-xs bg-white px-5 py-4 rounded-lg z-50 shadow-lg"
          onClick={() => setError(false)}
        >
          <div className="flex space-x-2 items-center">
            <Error />
            <p className="font-semibold text-lg">Oups...</p>
          </div>
          <span className="text-gray-500 text-md">{error}</span>
        </div>
      )}
    </SectionContainer>
  );
}
