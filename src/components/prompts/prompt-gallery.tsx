"use client";

import * as React from "react";
import { PromptCard } from "./prompt-card";
import { Prompt } from "@/types";

interface PromptGalleryProps {
  prompts: Prompt[];
  onDelete?: (id: string) => void;
  onDuplicate?: (prompt: Prompt) => void;
  onToggleFavorite?: (id: string, favorite: boolean) => void;
}

export function PromptGallery({ prompts, onDelete, onDuplicate, onToggleFavorite }: PromptGalleryProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-lg font-semibold mb-1">No prompts yet</h3>
        <p className="text-sm text-muted-foreground">Create your first prompt to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
