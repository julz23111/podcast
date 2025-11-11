// src/app/videos/page.tsx
import type { Metadata } from "next";
import { getVideos } from "@/lib/youtube";
import Link from "next/link";
import VideosList from "@/components/videos-list";

export const runtime = 'edge';

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Videos | The Weekly Bust",
  description: "Watch live shows and video episodes from The Weekly Bust.",
  alternates: { canonical: "/videos" },
};

type Props = { searchParams?: { pageToken?: string } };

export default async function VideosPage({ searchParams }: Props) {
  const pageToken = searchParams?.pageToken || null;
  const { videos, nextPageToken, prevPageToken } = await getVideos({
    pageToken,
    pageSize: 24,
  });

  return (
    <section className="space-y-8">
      {/* Header with glass overlay for contrast */}
      <div className="relative isolate max-w-2xl rounded-xl bg-black/45 p-4 backdrop-blur-sm ring-1 ring-white/10 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-white drop-shadow-md heading-tape">
            Videos
          </h1>
          <a
            className="text-sm underline text-white/90 hover:text-white"
            href="https://www.youtube.com/@theweeklybust"
            target="_blank"
            rel="noreferrer"
          >
            View all on YouTube →
          </a>
        </div>
        <p className="mt-2 text-white/90 drop-shadow">
          Live shows, clips, and full video episodes from{" "}
          <span className="font-semibold">The Weekly Bust</span>.
        </p>
      </div>

      {/* Grid */}
      <VideosList videos={videos} />

      {/* Pager */}
      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <div>
          {prevPageToken && (
            <Link
              className="text-sm underline text-white/90 hover:text-white"
              href={`/videos?pageToken=${encodeURIComponent(prevPageToken)}`}
            >
              ← Previous
            </Link>
          )}
        </div>
        <div>
          {nextPageToken && (
            <Link
              className="text-sm underline text-white/90 hover:text-white"
              href={`/videos?pageToken=${encodeURIComponent(nextPageToken)}`}
            >
              Next →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}