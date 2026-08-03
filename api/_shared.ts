import type { IncomingHttpHeaders } from "node:http";

export type ApiRequest = { method?: string; body?: unknown; headers: IncomingHttpHeaders; socket?: { remoteAddress?: string } };
export type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  write: (chunk: string) => void;
  end: () => void;
  headersSent?: boolean;
};

export function getClientIp(request: ApiRequest): string {
  const forwardedFor = request.headers["x-forwarded-for"];
  if (Array.isArray(forwardedFor)) return forwardedFor[0] ?? "unknown";
  if (typeof forwardedFor === "string") return forwardedFor.split(",")[0]?.trim() || "unknown";
  return request.socket?.remoteAddress || "unknown";
}

export function isRateLimited(history: Map<string, number[]>, ip: string, windowMs: number, maxRequests: number): boolean {
  const now = Date.now();
  const recent = (history.get(ip) ?? []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length >= maxRequests) return true;
  recent.push(now);
  history.set(ip, recent);
  return false;
}

export function methodNotAllowed(response: ApiResponse): void {
  response.setHeader("Allow", "POST");
  response.status(405).json({ error: "Method not allowed." });
}
