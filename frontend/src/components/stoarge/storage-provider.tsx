"use client";

import { useEffect } from "react";
import { initStorage } from "@/lib/storage";

export function StorageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initStorage();
  }, []);

  return <>{children}</>;
}
