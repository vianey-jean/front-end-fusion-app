
interface RateLimitRule {
  maxRequests: number;
  windowMs: number;
  lastReset: number;
  requestCount: number;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private rules: Map<string, RateLimitRule> = new Map();

  private constructor() {}

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public createRule(key: string, maxRequests: number, windowMs: number): void {
    this.rules.set(key, {
      maxRequests,
      windowMs,
      lastReset: Date.now(),
      requestCount: 0
    });
  }

  public isAllowed(key: string): boolean {
    const rule = this.rules.get(key);
    if (!rule) return true;

    const now = Date.now();
    
    // Réinitialiser si la fenêtre est expirée
    if (now - rule.lastReset > rule.windowMs) {
      rule.requestCount = 0;
      rule.lastReset = now;
    }

    // Vérifier la limite
    if (rule.requestCount >= rule.maxRequests) {
      return false;
    }

    rule.requestCount++;
    return true;
  }

  public getRemainingTime(key: string): number {
    const rule = this.rules.get(key);
    if (!rule) return 0;

    const now = Date.now();
    const timeUntilReset = rule.windowMs - (now - rule.lastReset);
    return Math.max(0, timeUntilReset);
  }
}
