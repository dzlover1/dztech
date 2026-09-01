"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLanguage } from "@/providers/language-provider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/types";
import { Sun, Moon, Globe, Sparkles, LayoutGrid, Stars } from "lucide-react";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [authed, setAuthed] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setAuthed(!!data.user);
    });
  }, []);

  const goTarget = authed ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Prompt Gallery</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              title={language === "en" ? "العربية" : "English"}
            >
              <Globe className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button asChild variant={authed ? "default" : "outline"}>
              <Link href={goTarget}>{authed ? t("dashboard") : t("login")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8">
          <Stars className="h-4 w-4" />
          AI Prompt Management Platform
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl md:text-7xl font-black leading-tight tracking-tight">
          <span className="gradient-text">{t("heroTitle")}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
          {t("heroSubtitle")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href={authed ? "/prompts" : "/login"}>
              <LayoutGrid className="h-5 w-5" />
              {t("explorePrompts")}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href={authed ? "/prompts/new" : "/register"}>
              <Sparkles className="h-5 w-5" />
              {t("addPrompt")}
            </Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{t("categories")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              href={authed ? `/categories/${cat.slug}` : "/login"}
              className="group rounded-xl border bg-card p-6 text-center hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <span className="text-4xl block mb-3">{cat.icon}</span>
              <p className="font-semibold text-sm">{language === "ar" ? cat.nameAr : cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="rounded-3xl border bg-gradient-to-br from-primary/10 via-transparent to-secondary p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            One Prompt. One Image. One Organized Library.
          </h3>
          <p className="text-muted-foreground mb-6">
            Every AI prompt with its own visual preview — organized, searchable, and ready to reuse.
          </p>
          <Button asChild size="lg">
            <Link href={authed ? "/prompts/new" : "/register"}>{t("addPrompt")}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-semibold">Prompt Gallery</span>
          </div>
          <p className="text-sm text-muted-foreground">AI Prompt Management Platform</p>
        </div>
      </footer>
    </div>
  );
}
