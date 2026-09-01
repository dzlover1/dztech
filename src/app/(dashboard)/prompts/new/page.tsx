"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { usePrompts, useUploadImage } from "@/hooks/use-prompts";
import { useLanguage } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CATEGORIES, AI_MODELS, LANGUAGES, AIOModel } from "@/types";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";

export default function NewPromptPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <NewPromptForm />
    </Suspense>
  );
}

function NewPromptForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { t, language } = useLanguage();
  const { prompts, addPrompt, updatePrompt } = usePrompts();
  const { uploadImage } = useUploadImage();

  const editing = editId ? prompts.find((p) => p.id === editId) : null;

  const [title, setTitle] = React.useState(editing?.title || "");
  const [description, setDescription] = React.useState(editing?.description || "");
  const [prompt, setPrompt] = React.useState(editing?.prompt || "");
  const [category, setCategory] = React.useState(editing?.category || "");
  const [subcategory, setSubcategory] = React.useState(editing?.subcategory || "");
  const [aiModel, setAiModel] = React.useState(editing?.ai_model || "");
  const [languageF, setLanguageF] = React.useState(editing?.language || "en");
  const [tags, setTags] = React.useState(editing?.tags?.join(", ") || "");
  const [image, setImage] = React.useState<string | null>(editing?.image_url || null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Prompt content is required");
      return;
    }

    setSaving(true);

    let imageUrl = editing?.image_url || null;

    // Upload image if a new file was selected
    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (url) imageUrl = url;
    }

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editing) {
      await updatePrompt(editing.id, {
        title,
        description,
        prompt,
        category,
        subcategory,
        ai_model: aiModel,
        language: languageF,
        tags: tagArray,
        image_url: imageUrl,
      });
      toast.success(t("promptSaved"));
      router.push(`/prompts/${editing.id}`);
    } else {
      const data = await addPrompt({
        title,
        description,
        prompt,
        category,
        subcategory,
        ai_model: aiModel,
        language: languageF,
        tags: tagArray,
        image_url: imageUrl,
      });
      if (data) {
        toast.success(t("promptSaved"));
        router.push(`/prompts/${data.id}`);
      }
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{editing ? t("edit") : t("addPrompt")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("title")} *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Physics Lesson Infographic" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("description")}</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("category")}</label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={CATEGORIES.map((c) => ({ value: c.slug, label: `${c.icon} ${language === "ar" ? c.nameAr : c.name}` }))}
                placeholder={t("category")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("subcategory")}</label>
              <Input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} placeholder="Subcategory" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("aiModel")}</label>
              <Select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                options={[...AI_MODELS, ...(aiModel && !AI_MODELS.includes(aiModel as AIOModel) ? [aiModel] : [])].map((m) => ({ value: m, label: m }))}
                placeholder={t("aiModel")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("language")}</label>
              <Select
                value={languageF}
                onChange={(e) => setLanguageF(e.target.value)}
                options={LANGUAGES.map((l) => ({ value: l.code, label: `${l.name} ${l.nameAr}` }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("tags")}</label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Education, Infographic, Arabic (comma separated)" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium">{t("uploadImage")}</label>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            {image ? (
              <div className="relative">
                <Image
                  src={image}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="rounded-lg w-full object-cover"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{t("dragDrop")}</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, JPEG, WEBP</p>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("prompt")} *</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste your full AI prompt here..."
          rows={12}
          className="font-mono text-sm"
          dir={languageF === "ar" ? "rtl" : "ltr"}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          {t("cancel")}
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : t("save")}
        </Button>
      </div>
    </div>
  );
}
