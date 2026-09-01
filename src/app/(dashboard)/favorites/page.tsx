"use client";

import * as React from "react";
import { PromptGallery } from "@/components/prompts/prompt-gallery";
import { usePrompts } from "@/hooks/use-prompts";
import { useLanguage } from "@/providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";

export default function FavoritesPage() {
  const { t } = useLanguage();
  const { prompts, deletePrompt, duplicatePrompt, toggleFavorite } = usePrompts();

  const favorites = prompts.filter((p) => p.favorite);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">★ {t("favorites")}</h1>
      {favorites.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-4xl mb-4">⭐</p>
            <p className="text-lg font-semibold mb-1">No favorites yet</p>
            <p className="text-sm text-muted-foreground">
              Click the star on any prompt to add it to your favorites
            </p>
          </CardContent>
        </Card>
      ) : (
        <PromptGallery
          prompts={favorites}
          onDelete={deletePrompt}
          onDuplicate={duplicatePrompt}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
