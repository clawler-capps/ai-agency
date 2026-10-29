import Script from "next/script";

// Renders a vendor chat widget loader (for example GoHighLevel's
// https://widgets.leadconnectorhq.com/loader.js) only when
// NEXT_PUBLIC_CHAT_WIDGET_SRC is set. Values are inlined at build time.
export default function ChatWidget() {
  const src = process.env.NEXT_PUBLIC_CHAT_WIDGET_SRC;
  if (!src) return null;

  const widgetId = process.env.NEXT_PUBLIC_CHAT_WIDGET_ID;
  const resourcesUrl = process.env.NEXT_PUBLIC_CHAT_WIDGET_RESOURCES_URL;

  return (
    <Script
      id="chat-widget"
      src={src}
      strategy="lazyOnload"
      {...(widgetId ? { "data-widget-id": widgetId } : {})}
      {...(resourcesUrl ? { "data-resources-url": resourcesUrl } : {})}
    />
  );
}
