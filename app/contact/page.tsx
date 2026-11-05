import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import BookingLink from "@/components/BookingLink";
import Todo from "@/components/Todo";
import { FOUNDER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — Sacramento AI Agency",
  description:
    "Have a question that isn't about booking a call? Send us a note and we'll get back to you as soon as we can.",
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
            <BookingLink
              location="contact"
              label="intro call"
              className="text-accent font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              intro call
            </BookingLink>{" "}
            is the fastest way in. But if you&apos;ve got a question, an idea, or
            anything else on your mind, this is your spot — drop us a note below and a
            real person will read it.
          </p>
        </div>
      </section>

      {/* Direct details */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 bg-paper">
        <dl className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="card p-4">
            <dt className="eyebrow mb-1">Phone</dt>
            <dd className="text-ink font-semibold">
              {FOUNDER.phone ? (
                <a href={`tel:${FOUNDER.phone.replace(/[^\d+]/g, "")}`} className="hover:text-accent">{FOUNDER.phone}</a>
              ) : (
                <Todo>business phone</Todo>
              )}
            </dd>
          </div>
          <div className="card p-4">
            <dt className="eyebrow mb-1">Email</dt>
            <dd className="text-ink font-semibold text-sm break-all">
              <a href={`mailto:${FOUNDER.email}`} className="hover:text-accent">{FOUNDER.email}</a>
            </dd>
          </div>
          <div className="card p-4">
            <dt className="eyebrow mb-1">Based in</dt>
            <dd className="text-ink font-semibold">{FOUNDER.city}</dd>
          </div>
        </dl>
      </section>

      {/* Form */}
      <section className="section-padding bg-cream section-divider">
        <ContactForm />
        <p className="mt-8 text-center text-sm text-muted max-w-xl mx-auto">
          I&apos;m based in Sacramento, so replies come from me directly. Thanks for
          your patience, and talk soon.
        </p>
      </section>
    </div>
  );
}
