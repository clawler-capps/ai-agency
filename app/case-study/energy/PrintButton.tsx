"use client";

import { track } from "@vercel/analytics";

// "Save as PDF" uses the browser's print dialog; the page is print-styled to two pages.
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        track("cta_click", { location: "case-summary", label: "Download PDF" });
        window.print();
      }}
      className="btn-primary px-6 py-3 print:hidden"
    >
      Download as PDF ↓
    </button>
  );
}
