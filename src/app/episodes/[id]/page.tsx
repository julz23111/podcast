import type { Metadata } from "next";
import { getEpisodeBySlug, getEpisodes } from "@/lib/rss";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import ShareBar from "@/components/share-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type EpisodePageProps = { params: { id: string } };

export const revalidate = 600;

function stripHtml(html: string) {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const slug = decodeURIComponent(params.id);
  const ep = await getEpisodeBySlug(slug);
  if (!ep) return { title: "Episode not found" };

  const description = stripHtml(ep.description).slice(0, 160);
  return {
    title: ep.title,
    description,
    openGraph: {
      title: ep.title,
      description,
      images: [{ url: `/episodes/${slug}/opengraph-image` }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ep.title,
      description,
      images: [`/episodes/${slug}/opengraph-image`],
    },
  };
}

export async function generateStaticParams() {
  const episodes = await getEpisodes();
  return episodes.slice(0, 20).map((ep) => ({ id: ep.slug }));
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const slug = decodeURIComponent(params.id);
  const episodes = await getEpisodes();
  const episode = episodes.find((e) => e.slug === slug);
  if (!episode) return notFound();

  const idx = episodes.findIndex((e) => e.slug === slug);
  const prev = idx > 0 ? episodes[idx - 1] : null;
  const next = idx < episodes.length - 1 ? episodes[idx + 1] : null;

  return (
    <article className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <Link href="/episodes" className="text-white/90 hover:underline">
          ← All episodes
        </Link>
      </div>

      {episode.image && (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={episode.image}
            alt={episode.title}
            className="w-full max-h-96 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
        </div>
      )}

      {/* Header with glass overlay for contrast */}
      <header className="relative isolate max-w-2xl rounded-xl bg-black/45 p-4 backdrop-blur-sm ring-1 ring-white/10 shadow-lg">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">
          {episode.title}
        </h1>
        {episode.publishedAt && (
          <Badge
            variant="secondary"
            className="mt-2 bg-white/10 text-white/90 backdrop-blur-sm"
          >
            {new Date(episode.publishedAt).toLocaleDateString()}
          </Badge>
        )}
      </header>

      {episode.audioUrl && (
        <div className="rounded-lg border border-white/20 p-3 shadow-sm lg:sticky lg:top-24 bg-black/40 backdrop-blur-sm">
          <audio controls className="w-full">
            <source src={episode.audioUrl} type="audio/mpeg" />
          </audio>
        </div>
      )}

      <ShareBar title={episode.title} />

      <div
        className="prose max-w-none text-white/90 drop-shadow prose-invert"
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />

      <nav className="flex items-center justify-between border-t border-white/20 pt-4">
        <div>
          {next && (
            <Button asChild variant="ghost" size="sm">
              <a href={`/episodes/${next.slug}`} className="text-white/90 hover:underline">
                ← Older: {next.title}
              </a>
            </Button>
          )}
        </div>
        <div>
          {prev && (
            <Button asChild variant="ghost" size="sm">
              <a href={`/episodes/${prev.slug}`} className="text-white/90 hover:underline">
                Newer: {prev.title} →
              </a>
            </Button>
          )}
        </div>
      </nav>
    </article>
  );
}