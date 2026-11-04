"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type LeadConnector = { chatWidget?: { openWidget?: () => void } };

const getApi = () =>
  (window as unknown as { leadConnector?: LeadConnector }).leadConnector?.chatWidget;

// The widget's GHL config sets placement to "embedded", which renders it always-open
// after the footer and makes openWidget a no-op. Switch it to a floating bubble.
// widgetPlacement is not part of GHL's documented API.
const setFloatingPlacement = () => {
  const el = document.querySelector<HTMLElement & { widgetPlacement?: string; active?: boolean }>(
    "chat-widget"
  );
  if (el?.widgetPlacement === "embedded") {
    el.widgetPlacement = "floating";
    el.active = false;
  }
};

// GoHighLevel (LeadConnector) chat widget, homepage only. The bubble stays in its
// default bottom corner; this adds a "Need a quick answer?" button that opens it via
// the widget's public API (window.leadConnector.chatWidget.openWidget).
export default function ChatWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onLoaded = () => {
      setFloatingPlacement();
      setReady(true);
    };
    if (getApi()?.openWidget) onLoaded();
    window.addEventListener("LC_chatWidgetLoaded", onLoaded);

    // The loader adds <chat-widget> to <body>, which survives client-side
    // navigation. Show it on the homepage, hide it when leaving.
    const el = document.querySelector<HTMLElement>("chat-widget");
    if (el) el.style.display = "";
    return () => {
      window.removeEventListener("LC_chatWidgetLoaded", onLoaded);
      const w = document.querySelector<HTMLElement>("chat-widget");
      if (w) w.style.display = "none";
    };
  }, []);

  return (
    <>
      {/* Hidden, not unmounted, until the widget loads so the layout doesn't jump */}
      <button
        type="button"
        onClick={() => getApi()?.openWidget?.()}
        className={`btn-secondary text-base px-8 py-4 ${ready ? "" : "invisible"}`}
      >
        Need a quick answer?
      </button>
      <Script
        src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id="6ae6c63d03d93fc52138845d"
        strategy="afterInteractive"
      />
    </>
  );
}
