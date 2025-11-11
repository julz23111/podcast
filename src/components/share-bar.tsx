"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = { title: string };

export default function ShareBar({ title }: Props) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined" ? window.location.href : "";

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="flex items-center gap-3">
      <Button onClick={copyLink} size="sm">
        {copied ? "Copied!" : "Copy Link"}
      </Button>

      <a href={twitterHref} target="_blank" rel="noreferrer">
        <Button variant="secondary" size="sm">Share on X</Button>
      </a>
    </div>
  );
}