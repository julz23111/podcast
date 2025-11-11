import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubscribePage() {
  return (
    <section className="space-y-8">
      {/* Header with glass overlay */}
      <div className="relative isolate max-w-2xl rounded-xl bg-black/45 p-4 backdrop-blur-sm ring-1 ring-white/10 shadow-lg">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">
          Subscribe
        </h1>
        <p className="mt-2 text-white/90 drop-shadow">
          Follow <span className="font-semibold">The Weekly Bust</span> on your
          favorite platform so you never miss an episode.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border border-white/20 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">RSS Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-white/90">
            <p>Use this link in any podcast app:</p>
            <code className="block break-all p-2 rounded bg-black/60 text-white border border-white/20">
              https://www.spreaker.com/show/5528640/episodes/feed
            </code>
            <a
              href="https://www.spreaker.com/show/5528640"
              target="_blank"
              rel="noreferrer"
            >
              <Button className="bg-white text-black hover:bg-white/90">
                Open on Spreaker
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="border border-white/20 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Spotify</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href="https://open.spotify.com/show/2UUupNQYOf46Jw9d2liFmL"
              target="_blank"
              rel="noreferrer"
            >
              <Button className="bg-white text-black hover:bg-white/90">
                Find on Spotify
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="border border-white/20 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Apple Podcasts</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href="https://podcasts.apple.com/us/podcast/the-weekly-bust/id1493032393"
              target="_blank"
              rel="noreferrer"
            >
              <Button className="bg-white text-black hover:bg-white/90">
                Find on Apple Podcasts
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="border border-white/20 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              YouTube
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href="https://www.youtube.com/c/theweeklybust"
              target="_blank"
              rel="noreferrer"
            >
              <Button className="bg-white text-black hover:bg-white/90">
                Find on YouTube 
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}