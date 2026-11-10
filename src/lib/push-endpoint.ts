const PUSH_SERVICE_HOSTS = new Set([
  "fcm.googleapis.com",
  "push.services.mozilla.com",
  "updates.push.services.mozilla.com",
  "web.push.apple.com",
]);

export function isValidPushEndpoint(value: unknown): value is string {
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const isKnownPushService =
      PUSH_SERVICE_HOSTS.has(hostname) ||
      hostname.endsWith(".notify.windows.com") ||
      // Chromium testing builds use this Google staging push service.
      (process.env.NODE_ENV !== "production" && hostname === "jmt17.google.com");

    return (
      url.protocol === "https:" &&
      url.port === "" &&
      !url.username &&
      !url.password &&
      isKnownPushService
    );
  } catch {
    return false;
  }
}
