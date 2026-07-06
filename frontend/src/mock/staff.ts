import type { StaffUser } from "@/types/models";

export const mockStaff: StaffUser[] = [
  {
    id: "staff_admin",
    displayName: "Fatemeh Admin",
    password: "11111111",
    email: "admin@streamtone.com",
    role: "admin",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatemeh",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "staff_support",
    displayName: "Support Agent",
    password: "11111111",
    email: "support@streamtone.com",
    role: "support",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=support",
    createdAt: "2024-01-01T00:00:00Z",
  },
];
