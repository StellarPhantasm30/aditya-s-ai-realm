// Minimal async semaphore. Used to cap concurrent requests per provider so
// bursts don't trigger provider-side rate limits.

export class Semaphore {
  private available: number;
  private queue: Array<() => void> = [];

  constructor(private readonly limit: number) {
    this.available = limit;
  }

  async acquire(): Promise<() => void> {
    if (this.available > 0) {
      this.available -= 1;
      return () => this.release();
    }
    return new Promise((resolve) => {
      this.queue.push(() => {
        this.available -= 1;
        resolve(() => this.release());
      });
    });
  }

  private release(): void {
    this.available += 1;
    const next = this.queue.shift();
    if (next) next();
  }
}

const semaphores = new Map<string, Semaphore>();

export function getSemaphore(key: string, limit: number): Semaphore {
  let s = semaphores.get(key);
  if (!s) {
    s = new Semaphore(limit);
    semaphores.set(key, s);
  }
  return s;
}
