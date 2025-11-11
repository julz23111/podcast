import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merch | The Weekly Bust",
  description: "Official Weekly Bust merch powered by Brandl Printing.",
  alternates: { canonical: "/merch" },
};

export default function MerchPage() {
  const src = "https://www.brandlprinting.com/the-weekly-bust";

  return (
    <section className="space-y-6">
      {/* Header with glass overlay for contrast */}
      <div className="relative isolate max-w-2xl rounded-xl bg-black/45 p-4 backdrop-blur-sm ring-1 ring-white/10 shadow-lg">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">Merch</h1>
        <p className="mt-2 text-white/90 drop-shadow">
          Official <span className="font-semibold">Weekly Bust</span> apparel &
          accessories powered by Brandl Printing.
          <br />
          If the shop doesn’t load below,&nbsp;
          <a
            className="underline text-white hover:text-blue-200"
            href={src}
            target="_blank"
            rel="noopener noreferrer"
          >
            open it in a new tab
          </a>.
        </p>
      </div>

      {/* Merch iframe */}
      <div className="h-[75vh] w-full overflow-hidden rounded-lg border border-white/20 shadow-md bg-black/40 backdrop-blur-sm">
        <iframe
          src={src}
          className="h-full w-full rounded-lg"
          title="Weekly Bust Merch"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}