"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePrompts } from "@/hooks/use-prompts";
import { useLanguage } from "@/providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface ParsedPrompt {
  title: string;
  description: string;
  prompt: string;
  category: string;
  ai_model: string;
  language: string;
  tags: string[];
  image_url?: string;
}

export default function ImportPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { addPrompt } = usePrompts();
  const [dragging, setDragging] = React.useState(false);

  function detectLanguage(text: string): string {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text) ? "ar" : "en";
  }

  function detectModel(promptText: string): string {
    const p = promptText.toLowerCase();
    if (p.includes('midjourney') || p.includes('--ar ')) return 'Midjourney';
    if (p.includes('dall-e') || p.includes('dalle')) return 'DALL-E';
    if (p.includes('gemini')) return 'Gemini';
    if (p.includes('veo')) return 'Veo';
    if (p.includes('claude')) return 'Claude';
    if (p.includes('chatgpt') || p.includes('gpt')) return 'ChatGPT';
    return 'Other';
  }

  function extractTitle(content: string, index: number): string {
    const lines = content.split('\n').filter((l) => l.trim());
    // Try first meaningful line as title
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.match(/^(#|\/\/|\/|describe|prompt|system)/i)) {
        return trimmed.slice(0, 60);
      }
    }
    return `Imported Prompt ${index + 1}`;
  }

  function extractTags(content: string): string[] {
    const tags: string[] = [];
    const hashtags = content.match(/#(\w+)/g) || [];
    hashtags.forEach((h) => tags.push(h.slice(1)));
    return [...new Set(tags)].slice(0, 10);
  }

  function parseJSON(content: string): ParsedPrompt[] {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        return data.map((item) => ({
          title: item.title || item.name || 'Untitled',
          description: item.description || '',
          prompt: item.prompt || item.content || JSON.stringify(item, null, 2),
          category: item.category || '',
          ai_model: item.ai_model || item.model || detectModel(item.prompt || ''),
          language: item.language || detectLanguage(item.prompt || ''),
          tags: item.tags || [],
          image_url: item.image || item.image_url || undefined,
        }));
      }
      if (data.prompt || data.title) {
        return [{
          title: data.title || 'Untitled',
          description: data.description || '',
          prompt: data.prompt || data.content || '',
          category: data.category || '',
          ai_model: data.ai_model || data.model || detectModel(data.prompt || ''),
          language: data.language || detectLanguage(data.prompt || ''),
          tags: data.tags || [],
          image_url: data.image || data.image_url || undefined,
        }];
      }
      return [];
    } catch {
      return [];
    }
  }

  function parseText(content: string): ParsedPrompt[] {
    // Split by any prompt separator patterns
    const blocks = content.split(/\n\s*\n\s*(?=[A-Z][a-z]+[:#]|Prompt\s*\d|#+\s|###)/i);
    return blocks
      .map((b, i) => {
        const trimmed = b.trim();
        if (!trimmed) return null;
        return {
          title: extractTitle(trimmed, i),
          description: trimmed.split('\n')[0] || '',
          prompt: trimmed,
          category: '',
          ai_model: detectModel(trimmed),
          language: detectLanguage(trimmed),
          tags: extractTags(trimmed),
        };
      })
      .filter((b): b is ParsedPrompt => b !== null)
      .slice(0, 50);
  }

  function parseCSV(content: string): ParsedPrompt[] {
    const lines = content.split('\n').filter((l) => l.trim());
    if (lines.length < 2) return [];
    const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const prompts: ParsedPrompt[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cells = splitCSVLine(lines[i]);
      const obj: Record<string, string> = {};
      header.forEach((h, idx) => {
        obj[h] = cells[idx] || '';
      });
      prompts.push({
        title: obj.title || obj.name || `Imported Prompt ${i}`,
        description: obj.description || '',
        prompt: obj.prompt || obj.content || obj.text || '',
        category: obj.category || '',
        ai_model: obj.ai_model || obj.model || detectModel(obj.prompt || ''),
        language: obj.language || detectLanguage(obj.prompt || ''),
        tags: (obj.tags || '').split(';').filter(Boolean).map((s) => s.trim()),
        image_url: obj.image || undefined,
      });
    }
    return prompts;
  }

  function splitCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuote && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (c === ',' && !inQuote) {
        result.push(current);
        current = '';
      } else {
        current += c;
      }
    }
    result.push(current);
    return result;
  }

  const handleFile = async (file: File) => {
    const content = await file.text();
    const ext = file.name.split('.').pop()?.toLowerCase();

    let parsed: ParsedPrompt[] = [];
    if (ext === 'json') parsed = parseJSON(content);
    else if (ext === 'csv') parsed = parseCSV(content);
    else parsed = parseText(content); // txt, md

    if (parsed.length === 0) {
      toast.error('No valid prompts found in file');
      return;
    }

    let imported = 0;
    for (const p of parsed) {
      const result = await addPrompt(p);
      if (result) imported++;
    }

    toast.success(`Imported ${imported} prompts successfully!`);
    router.push('/prompts');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      handleFile(f);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t("importPrompts")}</h1>

      <Card>
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
              dragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Drag & drop your file</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Supports JSON, TXT, Markdown, and CSV
            </p>
            <label className="cursor-pointer inline-flex">
              <span className="inline-flex h-10 items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                {t("import")}
              </span>
              <input
                type="file"
                accept=".json,.txt,.md,.csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    handleFile(f);
                  }
                }}
              />
            </label>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              For each imported prompt:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>A prompt record is generated automatically</li>
              <li>Title is extracted from the content</li>
              <li>Language is auto-detected (Arabic/English)</li>
              <li>AI model is detected from keywords</li>
              <li>Tags are extracted from hashtags</li>
              <li>Category can be set after import</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
