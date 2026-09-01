"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn, copyToClipboard, PLACEHOLDER_IMAGE } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/types";
import { Copy, Eye, Pencil, Star, Check, CopyPlus, Trash } from "lucide-react";
import toast from "react-hot-toast";

interface PromptCardProps {
  prompt: Prompt;
  onDelete?: (id: string) => void;
  onDuplicate?: (prompt: Prompt) => void;
  onToggleFavorite?: (id: string, favorite: boolean) => void;
}

export function PromptCard({ prompt, onDelete, onDuplicate, onToggleFavorite }: PromptCardProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await copyToClipboard(prompt.prompt);
    if (success) {
      setCopied(true);
      toast.success(t("copiedToClipboard"));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(prompt.id, !prompt.favorite);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete "${prompt.title}"?`)) {
      onDelete?.(prompt.id);
    }
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDuplicate?.(prompt);
  };

  return (
    <div className="group relative rounded-xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/prompts/${prompt.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={prompt.image_url || PLACEHOLDER_IMAGE}
            alt={prompt.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Favorite badge */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors z-10"
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                prompt.favorite
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted-foreground"
              )}
            />
          </button>

          {/* Hover actions overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopy}
              className="gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : t("copyPrompt")}
            </Button>
            <Link
              href={`/prompts/${prompt.id}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              {t("viewDetails")}
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base line-clamp-1">{prompt.title}</h3>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {prompt.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {prompt.category && (
              <Badge variant="secondary" className="text-xs">
                {prompt.category}
              </Badge>
            )}
            {prompt.ai_model && (
              <Badge variant="outline" className="text-xs">
                {prompt.ai_model}
              </Badge>
            )}
          </div>

          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {prompt.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-primary">
                  #{tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              {new Date(prompt.created_at).toLocaleDateString(
                language === "ar" ? "ar-EG" : "en-US",
                { year: "numeric", month: "short", day: "numeric" }
              )}
            </span>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/prompts/${prompt.id}?edit=true`);
                }}
                title={t("edit")}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleDuplicate}
                title={t("duplicate")}
              >
                <CopyPlus className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={handleDelete}
                title={t("delete")}
              >
                <Trash className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
