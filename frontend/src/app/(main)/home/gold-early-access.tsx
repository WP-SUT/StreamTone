import Link from "next/link";
import { Crown, Lock } from "lucide-react";

interface Props {
  isGold: boolean;
}

export default function GoldEarlyAccess({ isGold }: Props) {
  return (
    <section
      className="
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-transparent
        border border-yellow-500/30
        p-6 md:p-8
      "
    >
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-7 w-7 text-yellow-400 shrink-0" />
          <div>
             <h2>content Early Access</h2>
            <p className="text-sm text-white/60 mt-0.5">
              {isGold
                ? "You have access to exclusive content."
                : "Upgrade to Gold to unlock exclusive early-access content."}
            </p>
          </div>
        </div>

        {isGold ? (
          <Link
            href="/gold"
            className="
              shrink-0 rounded-xl bg-yellow-400 px-5 py-2.5
              text-sm font-semibold text-black
              hover:bg-yellow-300 transition-colors
            "
          >
            Browse Content
          </Link>
        ) : (
          <Link
            href="/plans"
            className="
              shrink-0 flex items-center gap-2 rounded-xl
              border border-yellow-500/40 px-5 py-2.5
              text-sm font-semibold text-yellow-400
              hover:bg-yellow-500/10 transition-colors
            "
          >
            <Lock className="h-4 w-4" />
            Upgrade to Gold
          </Link>
        )}
      </div>
    </section>
  );
}
