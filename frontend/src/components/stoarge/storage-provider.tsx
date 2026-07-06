"use client";

import { useState } from "react";
import { initStorage } from "@/lib/storage";

export function StorageProvider({ children }: { children: React.ReactNode }) {
  // Init synchronously before children mount/effects run (child useEffects run before parent useEffects)
  const [ready] = useState(() => {
    initStorage();
    return true;
  });

  if (!ready) return null;

  return <>{children}</>;
}
