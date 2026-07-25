import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { BOOKING_URL } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Contact — Sacramento AI Agency",
  description:
    "Have a question that isn't about booking a call? Send us a note and we'll get back to you as soon as we can.",
  // Pre-launch: the page is reachable by direct URL (a dependent build relies on
  // this slug) but intentionally unlinked and kept out of search results until
  // it's fully wired up. Remove this block to make it publicly discoverable.
  robots: { index: false, follow: false },
};

export default function ContactPage() {
  return (
    <div className="pt-20 bg-paper">
      {/* Header */}
      <section className="section-padding bg-paper border-b border-border">
        <div className="max-w-2xl mx-auto text-center">
          <p className="eyebrow mb-4">Say Hello</p>
          <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-6">
            Let&apos;s talk.
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Ready to book? The{" "}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              intro call
            </a>{" "}
            is the fastest way in. But if you&apos;ve got a question, an idea, or
            anything else on your mind, this is your spot — drop us a note below and a
            real person will read it.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-cream section-divider">
        <ContactForm />
        <p className="mt-8 text-center text-sm text-muted max-w-xl mx-auto">
          We&apos;re a small team based in Sacramento, so replies come from us
          directly — not a ticket queue. Thanks for your patience, and talk soon.
        </p>
      </section>
    </div>
  );
}
