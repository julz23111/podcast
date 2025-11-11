// src/app/videos/[id]/page.tsx
import type { Metadata } from "next";
import { getVideoById, getVideos } from "@/lib/youtube";
import { notFound } from "next/navigation";
import Link from "next/link";
import ShareBar from "@/components/share-bar";
import { Badge } from "@/components/ui/badge";

type PageProps = { params: { id: string } };

export const revalidate = 600;

export async function generateStaticParams() {
  const { videos: vids } = await getVideos({ pageSize: 20 }); // prebuild first 20
  return vids.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const v = await getVideoById(params.id);
  if (!v) return { title: "Video not found" };
  const description = (v.description || "").slice(0, 160);
  return {
    title: v.title,
    description,
    openGraph: {
      title: v.title,
      description,
      images: v.thumbnail ? [{ url: v.thumbnail }] : undefined,
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: v.title,
      description,
      images: v.thumbnail ? [v.thumbnail] : undefined,
    },
  };
}

export default async function VideoPage({ params }: PageProps) {
  const v = await getVideoById(decodeURIComponent(params.id));
  if (!v) return notFound();

  return (
    <article className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between text-sm">
        <Link href="/videos" className="text-white/90 hover:underline">
          ← All videos
        </Link>
        {v.publishedAt && (
          <Badge
            variant="secondary"
            className="bg-white/10 text-white/90 backdrop-blur-sm"
          >
            {new Date(v.publishedAt).toLocaleDateString()}
          </Badge>
        )}
      </div>

      {/* Title with glass overlay for contrast */}
      <header className="relative isolate max-w-3xl rounded-xl bg-black/45 p-4 backdrop-blur-sm ring-1 ring-white/10 shadow-lg">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">{v.title}</h1>
      </header>

      {/* Responsive 16:9 embed */}
      <div
        className="relative w-full overflow-hidden rounded-lg border border-white/20 bg-black/40 backdrop-blur-sm shadow-md"
        style={{ paddingTop: "56.25%" }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${v.id}`}
          className="absolute left-0 top-0 h-full w-full"
          title={v.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        {/* subtle gradient at bottom for controls legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <ShareBar title={v.title} />

      {/* Description */}
      <div
        className="prose max-w-none prose-invert text-white/90 drop-shadow"
        // if v.description has simple text, this still renders fine
      >
        <p>{v.description}</p>
      </div>
    </article>
  );
}