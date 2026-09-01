"use client";

import * as React from "react";
import Link from "next/link";
import { usePrompts } from "@/hooks/use-prompts";
import { useLanguage } from "@/providers/language-provider";
import { CATEGORIES } from "@/types";

export default function CategoriesPage() {
  const { language } = useLanguage();
  const { prompts } = usePrompts();

  const counts: Record<string, number> = {};
  prompts.forEach((p) => {
    if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group rounded-xl border bg-card p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 overflow-hidden relative"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
              style={{ background: `linear-gradient(135deg, ${cat.color}, transparent)` }}
            />
            <div className="relative">
              <span className="text-4xl mb-3 block">{cat.icon}</span>
              <h3 className="font-semibold mb-1">{language === "ar" ? cat.nameAr : cat.name}</h3>
              <p className="text-sm text-muted-foreground">{counts[cat.slug] || 0} prompts</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
