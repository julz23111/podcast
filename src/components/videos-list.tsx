"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type VideoLite = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string | null;
};

function stripHtml(html: string) {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function VideosList({ videos }: { videos: VideoLite[] }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<string>("all");

  const years = useMemo(() => {
    const s = new Set<string>();
    for (const v of videos) {
      if (v.publishedAt) s.add(new Date(v.publishedAt).getFullYear().toString());
    }
    return Array.from(s).sort((a, b) => Number(b) - Number(a));
  }, [videos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((v) => {
      const matchesQuery = q
        ? v.title.toLowerCase().includes(q) ||
          stripHtml(v.description).toLowerCase().includes(q)
        : true;
      const matchesYear =
        year === "all"
          ? true
          : v.publishedAt
          ? new Date(v.publishedAt).getFullYear().toString() === year
          : false;
      return matchesQuery && matchesYear;
    });
  }, [videos, query, year]);

  return (
    <section className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search videos…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-80"
          />
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filtered.length} video{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((v) => (
          <Card
            key={v.id}
            className="group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {v.thumbnail && (
              <div className="relative">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-lg" />
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-lg leading-snug">
                <Link href={`/videos/${v.id}`} className="hover:underline">
                  {v.title}
                </Link>
              </CardTitle>
              <Badge variant="secondary">
                {v.publishedAt ? new Date(v.publishedAt).toLocaleDateString() : "—"}
              </Badge>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                {stripHtml(v.description)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}