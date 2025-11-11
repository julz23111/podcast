import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About | The Weekly Bust",
  description:
    "What The Weekly Bust is about: creator economy, tech, and real talk with founders and makers.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="space-y-3">
        <div className="relative isolate max-w-2xl rounded-xl bg-black/45 p-4 backdrop-blur-sm ring-1 ring-white/10 shadow-lg">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">
            About The Weekly Bust
          </h1>
          <p className="text-white/90 drop-shadow max-w-2xl">
            The Weekly Bust is a show about the creator economy, tech, and building
            businesses in public. We mix interviews, live conversations, and deep
            dives—keeping it honest, useful, and a little chaotic (in a good way).
          </p>
        </div>
      </div>

      {/* What to expect */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle>What to expect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <ul className="list-disc pl-5 space-y-1">
              <li>Creator + founder interviews</li>
              <li>Live breakdowns of trends and tools</li>
              <li>Real numbers, real experiments</li>
              <li>Actionable takeaways every week</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle>Where to follow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                YouTube:{" "}
                <a
                  className="underline"
                  href="https://www.youtube.com/@theweeklybust"
                  target="_blank"
                >
                  @theweeklybust
                </a>
              </li>
              <li>
                Podcast feed:{" "}
                <Link className="underline" href="/episodes">
                  all episodes
                </Link>
              </li>
              <li>
                Videos:{" "}
                <Link className="underline" href="/videos">
                  latest lives &amp; clips
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Hosts (edit these bios anytime) */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white drop-shadow-md">Hosts</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Host Name</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 dark:text-gray-300">
              Yo! What's up everyone? I'm Levi, your weekly bust host. I hope you
              enjoy the show. Feel free to reach me on the{" "}
              <a href="/contact" className="underline">contact page</a>. Don't
              forget to like, share, and subscribe!
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Co-Host Name</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 dark:text-gray-300">
              It's the Bust World Baby! Like, comment and subscribe!
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Get in touch */}
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Get in touch</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 dark:text-gray-300">
          For bookings, sponsorships, or suggestions, head to the{" "}
          <Link className="underline" href="/contact">
            contact page
          </Link>
          .
        </CardContent>
      </Card>
    </section>
  );
}