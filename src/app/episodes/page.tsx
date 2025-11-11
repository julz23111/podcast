import type { Metadata } from "next";
import { getEpisodes } from "@/lib/rss";
import EpisodesList from "@/components/episodes-list";

export const revalidate = 600; // ISR: refresh every 10 minutes

export const metadata: Metadata = {
  title: "Episodes | The Weekly Bust Podcast",
  description:
    "Browse all episodes, play the latest show, and read detailed show notes.",
  alternates: { canonical: "/episodes" },
};

export default async function EpisodesPage() {
  const episodes = await getEpisodes();

  return (
    <section className="space-y-10">
      {/* Hero header with soft overlay */}
      <div className="relative isolate max-w-2xl rounded-xl bg-black/45 p-4 backdrop-blur-sm ring-1 ring-white/10 shadow-lg">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">
          Episodes
        </h1>
        <p className="mt-2 text-white/90 drop-shadow">
          Explore every episode of <span className="font-semibold">The Weekly Bust</span> —
          real conversations about tech, creativity, and building in public.
        </p>
      </div>

      {/* Episodes list component */}
      <div className="mt-4">
        <EpisodesList episodes={episodes} />
      </div>
    </section>
  );
}