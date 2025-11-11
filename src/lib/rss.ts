import { parse } from "rss-to-json";

export type Episode = {
  id: string;
  slug: string;           // NEW
  title: string;
  description: string;
  audioUrl: string | null;
  publishedAt: string;
  image?: string | null;
  link?: string | null;
  source?: string | null;
};

const FEEDS = (process.env.PODCAST_FEEDS || process.env.NEXT_PUBLIC_PODCAST_RSS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (FEEDS.length === 0) {
  throw new Error("Missing PODCAST_FEEDS or NEXT_PUBLIC_PODCAST_RSS in .env.local");
}

function slugify(input: string) {
  return (input || "")
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function hash8(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  // base36 for compactness
  return h.toString(36).slice(0, 8);
}

function imgString(x: any): string | null {
  if (!x) return null;
  if (typeof x === "string") return x;
  if (typeof x?.url === "string") return x.url;
  return null;
}

async function fetchFeed(url: string) {
  try {
    const feed: any = await parse(url);
    const items: any[] = feed?.items ?? [];

    return items.map((item) => {
      const rawId = item.id || item.guid || item.link || `${url}-${item.title}-${item.published || item.date || ""}`;
      const title = item.title ?? "Untitled episode";
      const uniqueKey = (item.enclosures?.[0]?.url || item.enclosure?.url || item.link || rawId) as string;
      const slug = `${slugify(title)}-${hash8(uniqueKey)}`;

      return {
        id: rawId,
        slug,
        title,
        description: item.description || item.content || "",
        audioUrl: item.enclosures?.[0]?.url || item.enclosure?.url || null,
        publishedAt: item.published || item.created || item.date || "",
        image: imgString(item.itunes_image) ?? imgString(feed.image) ?? null,
        link: item.link || null,
        source: url,
      } as Episode;
    });
  } catch (e) {
    console.error("Failed to parse feed:", url, e);
    return [] as Episode[];
  }
}

export async function getEpisodes(): Promise<Episode[]> {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const merged = results.flat();

  // Dedupe by audioUrl || link || id
  const seen = new Set<string>();
  const deduped: Episode[] = [];
  for (const ep of merged) {
    const key = ep.audioUrl || ep.link || ep.id;
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(ep);
  }

  // Sort newest first
  deduped.sort((a, b) => {
    const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return db - da;
  });

  return deduped;
}

export async function getEpisode(id: string) {
  const episodes = await getEpisodes();
  return episodes.find((ep) => ep.id === id) || null;
}

// NEW: fetch by slug
export async function getEpisodeBySlug(slug: string) {
  const episodes = await getEpisodes();
  return episodes.find((ep) => ep.slug === slug) || null;
}