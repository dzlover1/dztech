"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { PromptGallery } from "@/components/prompts/prompt-gallery";
import { usePrompts } from "@/hooks/use-prompts";
import { useLanguage } from "@/providers/language-provider";
import { CATEGORIES } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { language } = useLanguage();
  const { prompts, deletePrompt, duplicatePrompt, toggleFavorite } = usePrompts();

  const category = CATEGORIES.find((c) => c.slug === slug);
  const catPrompts = prompts.filter((p) => p.category === slug);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-5xl">{category?.icon || "📁"}</span>
        <div>
          <h1 className="text-2xl font-bold">
            {category ? (language === "ar" ? category.nameAr : category.name) : slug.replace(/-/g, " ")}
          </h1>
          <p className="text-muted-foreground">{catPrompts.length} prompts</p>
        </div>
      </div>

      <PromptGallery
        prompts={catPrompts}
        onDelete={deletePrompt}
        onDuplicate={duplicatePrompt}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
