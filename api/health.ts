import type { ApiRequest, ApiResponse } from "./_shared";

export default function handler(request: ApiRequest, response: ApiResponse): void {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }
  response.status(200).json({ status: "ok" });
}
