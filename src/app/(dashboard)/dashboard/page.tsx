"use client";

import * as React from "react";
import Link from "next/link";
import { usePrompts } from "@/hooks/use-prompts";
import { PromptCard } from "@/components/prompts/prompt-card";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/providers/language-provider";
import {
  FileText,
  FolderOpen,
  Image,
  Star,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { t } = useLanguage();
  const { prompts, deletePrompt, duplicatePrompt, toggleFavorite } = usePrompts();

  const totalPrompts = prompts.length;
  const totalCategories = new Set(prompts.map((p) => p.category).filter(Boolean)).size;
  const totalImages = prompts.filter((p) => p.image_url).length;
  const totalFavorites = prompts.filter((p) => p.favorite).length;

  const recentPrompts = [...prompts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const mostUsed = [...prompts]
    .sort((a, b) => b.usage_count - a.usage_count)
    .slice(0, 4);

  const stats = [
    { label: t("totalPrompts"), value: totalPrompts, icon: FileText, color: "text-violet-500 bg-violet-500/10" },
    { label: t("totalCategories"), value: totalCategories, icon: FolderOpen, color: "text-blue-500 bg-blue-500/10" },
    { label: t("totalImages"), value: totalImages, icon: Image, color: "text-green-500 bg-green-500/10" },
    { label: t("totalFavorites"), value: totalFavorites, icon: Star, color: "text-yellow-500 bg-yellow-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Most used */}
      {mostUsed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">{t("mostUsed")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mostUsed.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onDelete={deletePrompt}
                onDuplicate={duplicatePrompt}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent prompts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">{t("recentPrompts")}</h2>
          </div>
          <Link href="/prompts" className="text-sm text-primary hover:underline">
            {t("viewAll")}
          </Link>
        </div>
        {recentPrompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onDelete={deletePrompt}
                onDuplicate={duplicatePrompt}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-lg font-semibold mb-1">{t("noPrompts")}</p>
              <p className="text-sm text-muted-foreground mb-6">
                {t("heroSubtitle")}
              </p>
              <Link
                href="/prompts/new"
                className="inline-flex h-10 items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {t("addPrompt")}
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
