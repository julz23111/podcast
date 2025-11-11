import Link from "next/link";
import { getEpisodes } from "@/lib/rss";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVideos, getLiveVideo } from "@/lib/youtube";
import { headers } from "next/headers";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';


function stripHtml(html: string) {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function excerpt(text: string, max = 120) {
  const t = stripHtml(text);
  return t.length <= max ? t : t.slice(0, max).trimEnd() + "…";
}

export default async function HomePage() {
  const [live, { videos: vids }, episodes] = await Promise.all([
    getLiveVideo(),
    getVideos({ pageSize: 8 }),
    getEpisodes(),
  ]);
  const latestVideo = vids[0];
  const resolvedHeaders = await headers();
  const embedDomain = (resolvedHeaders.get("host") || "").split(":")[0] || "localhost";

  const gridVideos = live
    ? vids.filter((v) => v.id !== live.id).slice(0, 6)
    : vids.slice(1, 7);

  return (
    <section className="space-y-10">
      {/* Hero: live (if present) else latest video */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          {/* Enhanced contrast header */}
          <div className="relative isolate max-w-2xl rounded-xl bg-black/45 p-4 backdrop-blur-sm ring-1 ring-white/10 shadow-lg">
            <h1 className="text-3xl font-bold text-white drop-shadow-md heading-tape">
              The Weekly Bust
            </h1>
            <p className="mt-2 text-white/90 drop-shadow">
              Fresh takes, creator stories, and business breakdowns. Watch the
              latest live or dive into the podcast.
            </p>
          </div>
          {live && (
            <div className="mb-8">
              <div className="grid gap-4 lg:grid-cols-3">
                {/* Video player (2/3 width on large screens) */}
                <div className="lg:col-span-2">
                  <div
                    className="relative w-full overflow-hidden rounded-lg border border-white/20 shadow-lg"
                    style={{ paddingTop: "56.25%" }}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${live.id}`}
                      className="absolute left-0 top-0 h-full w-full"
                      title={live.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-3">
                    <h2 className="text-xl font-semibold text-white drop-shadow-md">
                      🔴 Live Now — {live.title}
                    </h2>
                    <p className="text-sm text-white/80 drop-shadow">
                      Streaming on{" "}
                      <a
                        href={`https://www.youtube.com/watch?v=${live.id}`}
                        target="_blank"
                        className="underline"
                      >
                        YouTube
                      </a>
                    </p>
                  </div>
                </div>

                {/* Live chat (desktop) */}
                <div className="hidden lg:block rounded-lg border border-white/20 shadow-lg bg-black/40 backdrop-blur-sm">
                  <div className="relative h-[560px] w-full overflow-hidden rounded-lg">
                    <iframe
                      src={`https://www.youtube.com/live_chat?v=${live.id}&amp;embed_domain=${embedDomain}`}
                      className="h-full w-full"
                      title="YouTube Live Chat"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="px-3 pb-3">
                    <a
                      href={`https://www.youtube.com/live_chat?v=${live.id}&amp;is_popout=1`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline text-white/90 hover:text-white"
                    >
                      Pop out chat ↗
                    </a>
                  </div>
                </div>
                {/* Live chat (mobile collapsible) */}
                <div className="lg:hidden">
                  <details className="rounded-lg border border-white/20 shadow-lg bg-black/40 backdrop-blur-sm open:pb-3">
                    <summary className="cursor-pointer select-none px-3 py-2 text-white/90">
                      Live chat
                    </summary>
                    <div className="relative h-[480px] w-full overflow-hidden rounded-lg">
                      <iframe
                        src={`https://www.youtube.com/live_chat?v=${live.id}&amp;embed_domain=${embedDomain}`}
                        className="h-full w-full"
                        title="YouTube Live Chat"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <div className="px-3 pt-2">
                      <a
                        href={`https://www.youtube.com/live_chat?v=${live.id}&amp;is_popout=1`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline text-white/90 hover:text-white"
                      >
                        Pop out chat ↗
                      </a>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          )}

          {!live && latestVideo && (
            <div>
              <div
                className="relative w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
                style={{ paddingTop: "56.25%" }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${latestVideo.id}`}
                  className="absolute left-0 top-0 h-full w-full"
                  title={latestVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="mt-3">
              <h2 className="text-xl font-semibold text-white drop-shadow-md">
                {latestVideo.title}
              </h2>
              <div className="text-sm text-white/90 drop-shadow">
                {latestVideo.publishedAt
                  ? new Date(latestVideo.publishedAt).toLocaleDateString()
                  : "—"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick links / CTAs */}
        <aside className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscribe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-gray-700 dark:text-gray-300">
                Get new episodes on your favorite platform.
              </p>
              <div className="flex flex-wrap gap-2">
                <a className="underline" href="/subscribe">All links</a>
                <a
                  className="underline"
                  href="https://www.youtube.com/@theweeklybust"
                  target="_blank"
                >
                  YouTube
                </a>
                {/* add Apple/Spotify links when you have them */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About the show</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 dark:text-gray-300">
              Creator economy, tech, and real talk. Learn more{" "}
              <Link className="underline" href="/about">
                about us
              </Link>
              .
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Recent Episodes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white drop-shadow-md">
            Recent Episodes
          </h2>
          <Link href="/episodes" className="text-sm underline text-white/90">
            View all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.slice(0, 6).map((ep) => (
            <Card
              key={ep.id}
              className="group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {ep.image && (
                <div className="relative">
                  <img
                    src={ep.image}
                    alt={ep.title}
                    className="w-full h-40 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-lg" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-base leading-snug">
                  <Link
                    href={`/episodes/${ep.slug}`}
                    className="hover:underline"
                  >
                    {ep.title}
                  </Link>
                </CardTitle>
                <Badge variant="secondary">
                  {ep.publishedAt
                    ? new Date(ep.publishedAt).toLocaleDateString()
                    : "—"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {excerpt(ep.description, 100)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Videos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white drop-shadow-md">
            Recent Videos
          </h2>
          <Link href="/videos" className="text-sm underline text-white/90">
            View all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridVideos.map((v) => (
            <Card
              key={v.id}
              className="group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {v.thumbnail && (
                <div className="relative">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-40 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-lg" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-base leading-snug">
                  <Link href={`/videos/${v.id}`} className="hover:underline">
                    {v.title}
                  </Link>
                </CardTitle>
                <Badge variant="secondary">
                  {v.publishedAt
                    ? new Date(v.publishedAt).toLocaleDateString()
                    : "—"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {v.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}