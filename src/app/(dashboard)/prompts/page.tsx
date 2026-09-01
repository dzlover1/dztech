"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PromptGallery } from "@/components/prompts/prompt-gallery";
import { SearchFilterBar } from "@/components/prompts/search-filter-bar";
import { usePrompts } from "@/hooks/use-prompts";
import { SortOption } from "@/types";
import { useLanguage } from "@/providers/language-provider";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PromptsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <PromptsContent />
    </Suspense>
  );
}

function PromptsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const { prompts, loading, deletePrompt, duplicatePrompt, toggleFavorite } = usePrompts();

  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = React.useState(initialSearch);
  const [category, setCategory] = React.useState("");
  const [aiModel, setAiModel] = React.useState("");
  const [language, setLanguage] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortOption>("newest");
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);

  const filtered = React.useMemo(() => {
    let result = [...prompts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.prompt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.ai_model.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      });
    }

    if (category) result = result.filter((p) => p.category === category);
    if (aiModel) result = result.filter((p) => p.ai_model === aiModel);
    if (language) result = result.filter((p) => p.language === language);
    if (showFavoritesOnly) result = result.filter((p) => p.favorite);

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "most_used":
        result.sort((a, b) => b.usage_count - a.usage_count);
        break;
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recently_updated":
        result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
    }

    return result;
  }, [prompts, searchQuery, category, aiModel, language, sortBy, showFavoritesOnly]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("allPrompts")}</h1>
        <Link
          href="/prompts/new"
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("addPrompt")}
        </Link>
      </div>

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        aiModel={aiModel}
        onAiModelChange={setAiModel}
        language={language}
        onLanguageChange={setLanguage}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border aspect-[3/4] animate-pulse bg-muted" />
          ))}
        </div>
      ) : (
        <PromptGallery
          prompts={filtered}
          onDelete={deletePrompt}
          onDuplicate={duplicatePrompt}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
