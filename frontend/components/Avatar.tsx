import { useAuth } from "@/lib/auth";

interface AvatarProps {
  size: string;
  fontSize: string;
}

export function Avatar({ size, fontSize }: AvatarProps) {
  const { user } = useAuth();
  return (
    <div
      className={`${size} bg-blue-500 rounded-full flex flex-col justify-center`}
    >
      <span
        className={`uppercase block text-center w-full text-white font-semibold text-${fontSize} tracking-wide select-none`}
      >
        {user.first_name[0] + user.last_name[0]}
      </span>
    </div>
  );
}
