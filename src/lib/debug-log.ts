const DEBUG_ENDPOINT =
  "http://127.0.0.1:7317/ingest/7e2cc370-04a9-4faf-9870-e46db1f84622";
const SESSION_ID = "bcb21f";

/** Debug-mode NDJSON ingest (local dev). No-op if ingest is unreachable. */
export function debugLog(payload: {
  location: string;
  message: string;
  hypothesisId: string;
  data?: Record<string, unknown>;
  runId?: string;
}): void {
  // #region agent log
  fetch(DEBUG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: SESSION_ID,
      timestamp: Date.now(),
      ...payload,
    }),
  }).catch(() => {});
  // #endregion
}
