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

// GoHighLevel (LeadConnector) chat widget, on the homepage, Pricing, Contact,
// and the Snapshot page. Mount once per page.
// The bubble stays in its default bottom corner; ChatLink below opens it from
// anywhere on the page via the widget's public API
// (window.leadConnector.chatWidget.openWidget).
export default function ChatWidget() {
  useEffect(() => {
    const onLoaded = () => setFloatingPlacement();
    if (getApi()?.openWidget) onLoaded();
    window.addEventListener("LC_chatWidgetLoaded", onLoaded);

    // The loader adds <chat-widget> to <body>, which survives client-side
    // navigation. Show it on pages that mount this, hide it when leaving.
    const el = document.querySelector<HTMLElement>("chat-widget");
    if (el) el.style.display = "";
    return () => {
      window.removeEventListener("LC_chatWidgetLoaded", onLoaded);
      const w = document.querySelector<HTMLElement>("chat-widget");
      if (w) w.style.display = "none";
    };
  }, []);

  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id="6ae6c63d03d93fc52138845d"
      strategy="afterInteractive"
    />
  );
}

// A text link that opens the chat. Hidden (not unmounted) until the widget
// loads, so it never shows as a dead link and the layout doesn't jump.
// `asButton` renders it as an outlined button instead of an underlined link.
export function ChatLink({
  children,
  className = "",
  asButton = false,
}: {
  children: React.ReactNode;
  className?: string;
  asButton?: boolean;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onLoaded = () => setReady(true);
    if (getApi()?.openWidget) setReady(true);
    window.addEventListener("LC_chatWidgetLoaded", onLoaded);
    return () => window.removeEventListener("LC_chatWidgetLoaded", onLoaded);
  }, []);

  return (
    <button
      type="button"
      onClick={() => getApi()?.openWidget?.()}
      className={`${asButton ? "btn-secondary" : "font-semibold underline underline-offset-4 hover:text-accent transition-colors"} ${ready ? "" : "invisible"} ${className}`}
    >
      {children}
    </button>
  );
}
