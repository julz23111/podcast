// src/lib/youtube.ts
const API = "https://www.googleapis.com/youtube/v3";

const KEY =
  (process.env.YOUTUBE_API_KEY ?? process.env.GOOGLE_API_KEY ?? "").trim();
const CHANNEL_ID = (process.env.YOUTUBE_CHANNEL_ID ?? "").trim();

if (!KEY) {
  console.warn(
    "[youtube.ts] Missing YOUTUBE_API_KEY (or GOOGLE_API_KEY). Live/YouTube features will be limited."
  );
}
if (!CHANNEL_ID) {
  console.warn("[youtube.ts] Missing YOUTUBE_CHANNEL_ID.");
}

export type Video = {
  id: string; // videoId
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string | null;
  url: string;
};

type FetchOpts = { revalidate?: number; noStore?: boolean };

async function getJson<T = unknown>(url: string, opts?: FetchOpts) {
  const init: RequestInit & { next?: { revalidate?: number } } = {};
  if (opts?.noStore) {
    init.cache = "no-store";
  } else {
    // cache on the edge for a bit to avoid hammering quota
    init.next = { revalidate: opts?.revalidate ?? 600 };
  }

  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const isQuota = res.status === 403 && /quota/i.test(text);
    const err = new Error(`YouTube API error ${res.status}: ${text}`);
    (err as any).code = res.status;
    (err as any).isQuota = isQuota;
    throw err;
  }
  return (await res.json()) as T;
}

// Get the channel's "uploads" playlist id
async function getUploadsPlaylistId(channelId: string): Promise<string> {
  const url = `${API}/channels?part=contentDetails&id=${channelId}&key=${KEY}`;
  const json = await getJson<any>(url);
  const uploads = json?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error("Could not resolve uploads playlist id");
  return uploads;
}

function mapItemToVideo(item: any): Video {
  const id = item?.contentDetails?.videoId ?? item?.id;
  const s = item.snippet || {};
  const thumbs = s.thumbnails || {};
  const thumb =
    thumbs.maxres?.url ||
    thumbs.high?.url ||
    thumbs.medium?.url ||
    thumbs.standard?.url ||
    thumbs.default?.url ||
    null;

  return {
    id,
    title: s.title || "",
    description: s.description || "",
    publishedAt: s.publishedAt || "",
    thumbnail: thumb,
    url: `https://www.youtube.com/watch?v=${id}`,
  };
}

// Lightweight oEmbed fallback that does not consume Data API quota
async function oembedFor(id: string): Promise<Video | null> {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const j = await res.json();
    return {
      id,
      title: j.title ?? "",
      description: j.author_name ?? "",
      publishedAt: "",
      thumbnail: j.thumbnail_url ?? null,
      url: `https://www.youtube.com/watch?v=${id}`,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch paged videos from the channel uploads.
 * Pass pageToken from a previous call to continue.
 * Soft-fails to an empty list on quota errors so builds never crash.
 */
export async function getVideos(opts?: {
  pageToken?: string | null;
  pageSize?: number;
}): Promise<{
  videos: Video[];
  nextPageToken?: string;
  prevPageToken?: string;
}> {
  try {
    if (!CHANNEL_ID) return { videos: [] };
    const uploadsId = await getUploadsPlaylistId(CHANNEL_ID);
    if (!uploadsId) return { videos: [] };

    const maxResults = Math.min(Math.max(opts?.pageSize ?? 24, 1), 50); // API limit 50
    const token = opts?.pageToken ? `&pageToken=${opts.pageToken}` : "";

    const url = `${API}/playlistItems?part=snippet,contentDetails&playlistId=${uploadsId}&maxResults=${maxResults}${token}&key=${KEY}`;
    const json = await getJson<any>(url);

    const videos = (json.items || []).map(mapItemToVideo);

    return {
      videos,
      nextPageToken: json.nextPageToken,
      prevPageToken: json.prevPageToken,
    };
  } catch (e: any) {
    if (e?.isQuota) {
      console.warn(
        "[youtube.ts] getVideos quota exceeded; returning empty list to avoid build failure."
      );
      return { videos: [] };
    }
    console.warn("[youtube.ts] getVideos failed:", e);
    return { videos: [] };
  }
}

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    const url = `${API}/videos?part=snippet&id=${id}&key=${KEY}`;
    const json = await getJson<any>(url);
    const item = json?.items?.[0];
    if (!item) return null;
    const v = mapItemToVideo({
      id,
      snippet: item.snippet,
      contentDetails: { videoId: id },
    });
    return v;
  } catch (e: any) {
    if (e?.isQuota) {
      console.warn(
        `[youtube.ts] getVideoById quota exceeded for ${id}; falling back to oEmbed.`
      );
      return await oembedFor(id);
    }
    console.warn("[youtube.ts] getVideoById failed:", e);
    return await oembedFor(id);
  }
}

/**
 * Fetch the current live stream (if the channel is live).
 * Returns the Video object or null if not live.
 * Always soft-fails to null to keep pages responsive.
 */
export async function getLiveVideo(): Promise<Video | null> {
  if (!KEY || !CHANNEL_ID) return null; // fail soft if config missing
  try {
    // Primary: explicit live search (public live streams)
    let url = `${API}/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${KEY}`;
    let json = await getJson<any>(url, { noStore: true });
    let item = json?.items?.[0];

    // Fallback: sometimes search doesn't surface the live yet; check latest video and inspect liveBroadcastContent
    if (!item) {
      url = `${API}/search?part=snippet&channelId=${CHANNEL_ID}&type=video&order=date&maxResults=1&key=${KEY}`;
      json = await getJson<any>(url, { noStore: true });
      const latest = json?.items?.[0];
      if (latest?.snippet?.liveBroadcastContent === "live") {
        item = latest;
      }
    }

    if (!item) return null;

    const vid = item.id?.videoId ?? item.id;
    return mapItemToVideo({
      id: vid,
      snippet: item.snippet,
      contentDetails: { videoId: vid },
    });
  } catch (err: any) {
    if (err?.isQuota) {
      console.warn("[youtube.ts] getLiveVideo quota exceeded; returning null.");
      return null;
    }
    console.warn("[youtube.ts] getLiveVideo failed:", err);
    return null;
  }
}