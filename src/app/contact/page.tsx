import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | The Weekly Bust",
  description:
    "Get in touch with The Weekly Bust team for bookings, sponsorships, or general inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="space-y-8 max-w-2xl mx-auto">
      {/* Glass overlay header for contrast */}
      <div className="relative isolate rounded-xl bg-black/45 p-4 backdrop-blur-sm ring-1 ring-white/10 shadow-lg">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">
          Contact Us
        </h1>
        <p className="mt-2 text-white/90 drop-shadow">
          Have a question, sponsorship inquiry, or just want to say hi? Fill out
          the form below and we’ll get back to you soon.
        </p>
      </div>

      {/* Form container */}
      <div className="rounded-lg border border-white/20 bg-black/40 p-4 shadow-md backdrop-blur-sm">
        <ContactForm />
      </div>
    </section>
  );
}