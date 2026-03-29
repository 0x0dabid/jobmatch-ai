// Usage tracking with localStorage (client-side) for free tier
// In production, replace with a database

const FREE_MONTHLY_LIMIT = 3;
const STORAGE_KEY = "jobmatch_usage";

export type UsageData = {
  count: number;
  resetDate: string; // ISO date string - first day of next month
};

function getResetDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}

function isExpired(resetDate: string): boolean {
  return new Date() >= new Date(resetDate);
}

export function getUsage(): UsageData {
  if (typeof window === "undefined") {
    return { count: 0, resetDate: getResetDate() };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { count: 0, resetDate: getResetDate() };
    }

    const data: UsageData = JSON.parse(stored);

    // Reset if expired
    if (isExpired(data.resetDate)) {
      const fresh: UsageData = { count: 0, resetDate: getResetDate() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }

    return data;
  } catch {
    return { count: 0, resetDate: getResetDate() };
  }
}

export function incrementUsage(): UsageData {
  const current = getUsage();
  const updated: UsageData = { count: current.count + 1, resetDate: current.resetDate };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function canAnalyze(isPro: boolean): boolean {
  if (isPro) return true;
  const usage = getUsage();
  return usage.count < FREE_MONTHLY_LIMIT;
}

export function getRemainingFree(isPro: boolean): number {
  if (isPro) return Infinity;
  const usage = getUsage();
  return Math.max(0, FREE_MONTHLY_LIMIT - usage.count);
}

export function getDaysUntilReset(): number {
  const usage = getUsage();
  const reset = new Date(usage.resetDate);
  const now = new Date();
  const diff = reset.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
