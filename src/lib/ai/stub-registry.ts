export const AI_CONFIG = {
  mode: (process.env.NEXT_PUBLIC_AI_MODE as "stub" | "live") || "stub",
  stubDelayMs: 1500 as number,
} as const;

export async function simulateDelay(ms: number = AI_CONFIG.stubDelayMs as number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
