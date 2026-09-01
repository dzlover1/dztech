"use client";

import * as React from "react";
import Link from "next/link";
import { useCollections } from "@/hooks/use-prompts";
import { usePrompts } from "@/hooks/use-prompts";
import { useLanguage } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FolderPlus, FolderOpen } from "lucide-react";

export default function CollectionsPage() {
  const { t } = useLanguage();
  const { collections, addCollection } = useCollections();
  const { prompts } = usePrompts();
  const [showForm, setShowForm] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [icon, setIcon] = React.useState("📁");

  const promptCount = () => prompts.length;

  const handleCreate = async () => {
    if (!name.trim()) return;
    await addCollection(name, description, icon);
    setName("");
    setDescription("");
    setShowForm(false);
  };

  const iconOptions = ["📁", "🎨", "🎬", "📚", "📢", "⭐", "🧠", "✍️", "💡", "🛒"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("collections")}</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <FolderPlus className="h-4 w-4 mr-1" />
          {t("createCollection")}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("collectionName")}</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. My Best Gemini Prompts" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Icon</label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setIcon(opt)}
                    className={`h-10 w-10 rounded-lg border text-xl transition-colors ${
                      icon === opt ? "bg-primary/10 border-primary" : "hover:bg-muted"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("description")}</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={handleCreate}>{t("save")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className="group rounded-xl border bg-card p-6 hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl">{collection.icon}</span>
              <FolderOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold mb-1">{collection.name}</h3>
            {collection.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{collection.description}</p>
            )}
            <p className="text-xs text-muted-foreground">{promptCount()} prompts</p>
          </Link>
        ))}
      </div>

      {collections.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-4xl mb-4">🗂️</p>
            <p className="text-lg font-semibold mb-1">No collections yet</p>
            <p className="text-sm text-muted-foreground">{t("createCollection")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
