"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export type EpisodeLite = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string | null;
  publishedAt: string;
};

function stripHtml(html: string) {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function excerpt(text: string, max = 160) {
  const t = stripHtml(text);
  return t.length <= max ? t : t.slice(0, max).trimEnd() + "…";
}

export default function EpisodesList({ episodes }: { episodes: EpisodeLite[] }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<string>("all");

  const years = useMemo(() => {
    const set = new Set<string>();
    for (const ep of episodes) {
      if (ep.publishedAt) {
        set.add(new Date(ep.publishedAt).getFullYear().toString());
      }
    }
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [episodes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return episodes.filter((ep) => {
      const matchesQuery = q
        ? ep.title.toLowerCase().includes(q) ||
          stripHtml(ep.description).toLowerCase().includes(q)
        : true;
      const matchesYear =
        year === "all"
          ? true
          : ep.publishedAt
          ? new Date(ep.publishedAt).getFullYear().toString() === year
          : false;
      return matchesQuery && matchesYear;
    });
  }, [episodes, query, year]);

  return (
    <section className="space-y-4">
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search episodes…"
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
          {filtered.length} episode{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Episode grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((ep) => (
          <Card
            key={ep.id}
            className="group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {ep.image && (
              <div className="relative">
                <img
                  src={ep.image}
                  alt={ep.title}
                  className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-lg" />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg leading-snug">
                <Link href={`/episodes/${ep.slug}`} className="hover:underline">
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
                {excerpt(ep.description)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}