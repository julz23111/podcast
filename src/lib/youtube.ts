// src/lib/youtube.ts
const API = "https://www.googleapis.com/youtube/v3";

const KEY = (process.env.YOUTUBE_API_KEY ?? process.env.GOOGLE_API_KEY ?? "");
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!;

if (!KEY) {
  console.warn("[youtube.ts] Missing YOUTUBE_API_KEY (or GOOGLE_API_KEY). Live/YouTube features will be disabled.");
}

export type Video = {
  id: string; // videoId
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string | null;
  url: string;
};

async function getJson<T = any>(url: string, opts?: { revalidate?: number; noStore?: boolean }) {
  const init: RequestInit & { next?: { revalidate?: number } } = {};
  if (opts?.noStore) {
    init.cache = "no-store";
  } else {
    init.next = { revalidate: opts?.revalidate ?? 600 };
  }
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${text}`);
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

/**
 * Fetch paged videos from the channel uploads.
 * Pass pageToken from a previous call to continue.
 */
export async function getVideos(opts?: {
  pageToken?: string | null;
  pageSize?: number;
}): Promise<{
  videos: Video[];
  nextPageToken?: string;
  prevPageToken?: string;
}> {
  const uploadsId = await getUploadsPlaylistId(CHANNEL_ID);
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
}

export async function getVideoById(id: string): Promise<Video | null> {
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
}
/**
 * Fetch the current live stream (if the channel is live).
 * Returns the Video object or null if not live.
 */
export async function getLiveVideo(): Promise<Video | null> {
  if (!KEY) return null; // fail soft if key missing
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
  } catch (err) {
    console.warn("[youtube.ts] getLiveVideo failed:", err);
    return null;
  }
}