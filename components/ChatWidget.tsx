"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type LeadConnector = { chatWidget?: { openWidget?: () => void } };

const getApi = () =>
  (window as unknown as { leadConnector?: LeadConnector }).leadConnector?.chatWidget;

// GoHighLevel (LeadConnector) chat widget, homepage only. The bubble stays in its
// default bottom corner; this adds a "Chat with our AI" button that opens it via
// the widget's public API (window.leadConnector.chatWidget.openWidget).
export default function ChatWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onLoaded = () => setReady(true);
    if (getApi()?.openWidget) setReady(true);
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
      {ready && (
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() => getApi()?.openWidget?.()}
            className="btn-secondary text-sm px-6 py-3"
          >
            Chat with our AI →
          </button>
        </div>
      )}
      <Script
        src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id="6ae6c63d03d93fc52138845d"
        strategy="afterInteractive"
      />
    </>
  );
}
