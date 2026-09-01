"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useCollections, usePrompts } from "@/hooks/use-prompts";
import { PromptGallery } from "@/components/prompts/prompt-gallery";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { collections, deleteCollection } = useCollections();
  const { prompts, deletePrompt, duplicatePrompt, toggleFavorite } = usePrompts();

  const collection = collections.find((c) => c.id === id);
  const collectionPrompts = prompts.filter((p) => p.id && collection !== undefined);

  const handleDelete = async () => {
    if (confirm(`Delete collection "${collection?.name}"?`)) {
      await deleteCollection(id);
      router.push("/collections");
    }
  };

  if (!collection) {
    return <p className="text-muted-foreground text-center py-20">Collection not found</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{collection.icon}</span>
            <h1 className="text-2xl font-bold">{collection.name}</h1>
          </div>
          {collection.description && (
            <p className="text-muted-foreground">{collection.description}</p>
          )}
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>

      <PromptGallery
        prompts={collectionPrompts}
        onDelete={deletePrompt}
        onDuplicate={duplicatePrompt}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
