"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import type { StaffUser, UserRole } from "@/types/models";

export function useStaffGuard(...allowedRoles: UserRole[]) {
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const rolesKey = allowedRoles.join(",");

  useEffect(() => {
    const session = storage.session.get();
    if (!session || !allowedRoles.includes(session.role)) {
      setLoading(false);
      router.push("/login");
      return;
    }
    if (session.role === "admin" || session.role === "support") {
      setUser(session as StaffUser);
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router, rolesKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { user, loading };
}
