"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mqadlrkw", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle>Send a message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <Input id="name" name="name" type="text" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="message">
              Message
            </label>
            <Textarea id="message" name="message" rows={5} required />
          </div>

          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending…" : "Send"}
          </Button>

          {status === "success" && (
            <p className="text-green-600 dark:text-green-400 text-sm mt-2">
              ✅ Message sent! Thanks, we’ll reply soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">
              ❌ Something went wrong. Please try again.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}