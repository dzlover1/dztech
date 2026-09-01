"use client";

import * as React from "react";
import { useLanguage } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SortOption, CATEGORIES, AI_MODELS } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  aiModel: string;
  onAiModelChange: (model: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  aiModel,
  onAiModelChange,
  language,
  onLanguageChange,
  sortBy,
  onSortChange,
  showFavoritesOnly,
  onToggleFavorites,
}: SearchFilterBarProps) {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = React.useState(false);

  const hasActiveFilters = category || aiModel || language || showFavoritesOnly;

  const clearFilters = () => {
    onCategoryChange("");
    onAiModelChange("");
    onLanguageChange("");
    onToggleFavorites();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("search")}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
          )}
        </Button>
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          options={[
            { value: "newest", label: t("newest") },
            { value: "oldest", label: t("oldest") },
            { value: "most_used", label: t("mostUsed") },
            { value: "alphabetical", label: t("alphabetical") },
            { value: "recently_updated", label: t("recentlyUpdated") },
          ]}
          className="w-48"
        />
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border bg-muted/30">
          <Select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={CATEGORIES.map((c) => ({ value: c.slug, label: `${c.icon} ${c.name}` }))}
            placeholder="All Categories"
            className="w-48"
          />
          <Select
            value={aiModel}
            onChange={(e) => onAiModelChange(e.target.value)}
            options={AI_MODELS.map((m) => ({ value: m, label: m }))}
            placeholder="All AI Models"
            className="w-48"
          />
          <Select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            options={[
              { value: "en", label: "English" },
              { value: "ar", label: "Arabic" },
            ]}
            placeholder="All Languages"
            className="w-48"
          />
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={onToggleFavorites}
          >
            ★ Favorites
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-3.5 w-3.5 mr-1" />
              {t("clearFilters")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
