"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { usePrompts } from "@/hooks/use-prompts";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PromptVersion } from "@/types";
import {
  Copy,
  Pencil,
  Download,
  Star,
  CopyPlus,
  Trash,
  Check,
  ArrowLeft,
  History,
} from "lucide-react";
import { cn, copyToClipboard, downloadFile, PLACEHOLDER_IMAGE } from "@/lib/utils";

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { t, language } = useLanguage();
  const { prompts, deletePrompt, toggleFavorite, duplicatePrompt, incrementUsage } = usePrompts();

  const prompt = prompts.find((p) => p.id === id);
  const [copied, setCopied] = React.useState(false);
  const [versions, setVersions] = React.useState<PromptVersion[]>([]);
  const supabase = createClient();
  const countedId = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (prompt && countedId.current !== prompt.id) {
      countedId.current = prompt.id;
      incrementUsage(prompt.id);
    }
  }, [prompt, incrementUsage]);

  React.useEffect(() => {
    if (!id) return;
    supabase
      .from("prompt_versions")
      .select("*")
      .eq("prompt_id", id)
      .order("version", { ascending: false })
      .then(({ data }) => {
        if (data) setVersions(data as PromptVersion[]);
      });
  }, [id, supabase]);

  const handleCopy = async () => {
    if (!prompt) return;
    const success = await copyToClipboard(prompt.prompt);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!prompt) return;
    if (confirm(`Delete "${prompt.title}"?`)) {
      await deletePrompt(prompt.id);
      router.push("/prompts");
    }
  };

  const handleDuplicate = async () => {
    if (!prompt) return;
    const newPrompt = await duplicatePrompt(prompt);
    if (newPrompt) router.push(`/prompts/${newPrompt.id}`);
  };

  if (!prompt) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Loading prompt...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header: image + info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative aspect-video rounded-2xl overflow-hidden border bg-muted">
          <Image
            src={prompt.image_url || PLACEHOLDER_IMAGE}
            alt={prompt.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold">{prompt.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(prompt.id, !prompt.favorite)}
            >
              <Star
                className={cn(
                  "h-6 w-6",
                  prompt.favorite && "fill-yellow-500 text-yellow-500"
                )}
              />
            </Button>
          </div>

          <p className="text-muted-foreground">{prompt.description}</p>

          <div className="flex flex-wrap gap-2">
            {prompt.category && <Badge>{prompt.category}</Badge>}
            {prompt.subcategory && <Badge variant="secondary">{prompt.subcategory}</Badge>}
            {prompt.ai_model && <Badge variant="outline">{prompt.ai_model}</Badge>}
            {prompt.language && <Badge variant="outline">{prompt.language}</Badge>}
          </div>

          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <span key={tag} className="text-sm text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            <Button onClick={handleCopy} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : t("copyPrompt")}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/prompts/new?edit=${prompt.id}`)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              {t("edit")}
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadFile(prompt.prompt, `${prompt.title}.txt`, "text/plain")}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {t("download")}
            </Button>
            <Button variant="outline" onClick={handleDuplicate} className="gap-2">
              <CopyPlus className="h-4 w-4" />
              {t("duplicate")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash className="h-4 w-4" />
              {t("delete")}
            </Button>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t">
            <span>
              Created:{" "}
              <b>
                {new Date(prompt.created_at).toLocaleDateString(
                  language === "ar" ? "ar-EG" : "en-US",
                  { year: "numeric", month: "short", day: "numeric" }
                )}
              </b>
            </span>
            <span>
              {t("language")}: <b>{prompt.language}</b>
            </span>
            <span>
              {t("version")}:{" "}
              <b>{versions.length + 1}.0</b>
            </span>
            <span>
              Used: <b>{prompt.usage_count}</b>
            </span>
          </div>
        </div>
      </div>

      {/* Full prompt */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="h-5 w-5" />
            {t("versionHistory")}
          </h2>
        </div>

        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="font-mono text-sm">V{versions.length + 1}.0</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {t("copyPrompt")}
            </Button>
          </div>
          <pre
            className="p-6 font-mono text-sm whitespace-pre-wrap break-words overflow-x-auto"
            dir={prompt.language === "ar" ? "rtl" : "ltr"}
          >
            {prompt.prompt}
          </pre>
        </div>
      </div>
    </div>
  );
}
