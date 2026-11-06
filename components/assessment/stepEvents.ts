// Anonymous step events for the Snapshot funnel (Steps tab of Tyler's sheet).
// One event per step, the first time a visitor completes it. Multiple-choice
// steps send the option letter only (the server turns it into the option
// text); every other step sends no content at all. Never send free text here.

import { useCallback, useRef } from "react";
import type { StepId } from "./steps";

function randomId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function send(body: string) {
  try {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/snapshot-event", blob)) return;
  } catch {
    // Fall through to fetch.
  }
  fetch("/api/snapshot-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function useStepEvents() {
  // A new random id per visit (per page load). Nothing is stored on the device.
  const session = useRef("");
  const device = useRef("");
  const sent = useRef(new Set<StepId>());

  return useCallback((stepId: StepId, label?: string) => {
    if (typeof window === "undefined" || sent.current.has(stepId)) return;
    sent.current.add(stepId);
    if (!session.current) {
      session.current = randomId();
      // Decided once per visit, so a resized window doesn't split a session.
      device.current = window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
    }
    send(
      JSON.stringify({
        session_id: session.current,
        step_id: stepId,
        label: label ?? "",
        device: device.current,
        // Deliberate test runs: /assessment?test=1
        test: new URLSearchParams(window.location.search).get("test") === "1",
      })
    );
  }, []);
}
