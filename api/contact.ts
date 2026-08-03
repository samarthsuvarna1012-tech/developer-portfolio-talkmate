import { getClientIp, isRateLimited, methodNotAllowed, type ApiRequest, type ApiResponse } from "./_shared";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const requestHistory = new Map<string, number[]>();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type ContactPayload = { name?: unknown; email?: unknown; message?: unknown; company?: unknown };

export default async function handler(request: ApiRequest, response: ApiResponse): Promise<void> {
  if (request.method !== "POST") return methodNotAllowed(response);
  const { name, email, message, company } = (request.body ?? {}) as ContactPayload;
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedEmail = typeof email === "string" ? email.trim() : "";
  const trimmedMessage = typeof message === "string" ? message.trim() : "";
  const trimmedCompany = typeof company === "string" ? company.trim() : "";

  if (trimmedCompany) { response.status(400).json({ error: "Your message could not be processed." }); return; }
  if (!trimmedName || !trimmedEmail || !trimmedMessage) { response.status(400).json({ error: "Please complete all fields before sending your message." }); return; }
  if (!EMAIL_PATTERN.test(trimmedEmail)) { response.status(400).json({ error: "Please provide a valid email address." }); return; }
  if (trimmedMessage.length < 10) { response.status(400).json({ error: "Your message should be at least 10 characters long." }); return; }
  if (isRateLimited(requestHistory, getClientIp(request), WINDOW_MS, MAX_REQUESTS)) {
    response.status(429).json({ error: "Too many messages were sent from this address. Please try again later." }); return;
  }

  const contactEndpoint = process.env.CONTACT_FORM_ENDPOINT;
  if (!contactEndpoint) { response.status(503).json({ error: "Contact delivery is not configured yet. Please use the email link instead." }); return; }
  try {
    const delivery = await fetch(contactEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: trimmedName, email: trimmedEmail, message: trimmedMessage, _subject: `Portfolio message from ${trimmedName}` }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!delivery.ok) throw new Error(`Contact provider responded with ${delivery.status}`);
    response.status(200).json({ success: true, message: "Your message was delivered successfully. Thank you!" });
  } catch (error) {
    console.error("Contact delivery failed:", error);
    response.status(502).json({ error: "Your message could not be delivered. Please try again later or use the email link." });
  }
}
