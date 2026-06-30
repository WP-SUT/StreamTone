import Image from "next/image";
import { UserCircle2 } from "lucide-react";
import { User } from "@/types";

interface Props {
  user: User | null;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function UserGreeting({ user }: Props) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden bg-white/10">
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.displayName}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserCircle2 className="h-8 w-8 text-white/40" />
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-white/50">{getGreeting()}</p>
        <h1 className="text-xl font-bold text-white">
          {user?.displayName ?? "Guest"}
        </h1>
      </div>
    </div>
  );
}
