import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { UserType } from "./types";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser]: [UserType, Dispatch<any>] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const readLocalToken = async () => {
      const token = localStorage.getItem("access_token");
      token && setUser(jwt_decode(token).user);
    };

    !user && readLocalToken();
  }, []);

  const signIn = (email: string, password: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOSTNAME}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        setError(null);
        const token = data.access_token;
        setUser(jwt_decode(data.access_token).user);
        localStorage.setItem("access_token", token);
        router.push("/dashboard");
      })
      .catch((err) => {
        setUser(err);
        setError(err.message);
      });
  };

  const signOut = () => {
    router.push("/");
    localStorage.removeItem("access_token");
    setUser(null);
  };

  const updateUser = (newProfile) => {
    localStorage.removeItem("access_token");
    setUser({ ...user, newProfile });
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, error, setError, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
