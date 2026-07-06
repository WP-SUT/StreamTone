import { storage } from "@/lib/storage";
import type { RevenueOverview, SubscriptionPricing } from "@/types/models";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export const revenueService = {
  async getPricing(): Promise<SubscriptionPricing> {
    await delay();
    return storage.pricing.get();
  },

  async updatePricing(silverMonthly: number, goldMonthly: number): Promise<SubscriptionPricing> {
    await delay(300);
    const pricing: SubscriptionPricing = {
      silverMonthly,
      goldMonthly,
      updatedAt: new Date().toISOString(),
    };
    storage.pricing.set(pricing);
    return pricing;
  },

  async getOverview(): Promise<RevenueOverview> {
    await delay();
    const users = storage.users.getAll();
    const free = users.filter((u) => !u.isPremium).length;
    const silver = Math.max(1, Math.floor(users.length * 0.35));
    const gold = Math.max(1, Math.floor(users.length * 0.15));
    const pricing = storage.pricing.get();

    return {
      totalRevenue: 128_500_000,
      monthlyRevenue: 24_300_000,
      subscriptionBreakdown: { free, silver, gold },
      monthlyTrend: [
        { month: "Feb", revenue: 18_200_000 },
        { month: "Mar", revenue: 19_800_000 },
        { month: "Apr", revenue: 21_100_000 },
        { month: "May", revenue: 22_400_000 },
        { month: "Jun", revenue: 23_600_000 },
        { month: "Jul", revenue: 24_300_000 },
      ],
    };
  },

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
  },
};
