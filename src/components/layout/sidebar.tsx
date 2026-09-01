"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Star,
  Settings,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Palette,
  Video,
  BookOpen,
  Megaphone,
  Share2,
  Layers,
  BarChart3,
  Film,
  Brain,
  Code,
  FileStack,
  ShoppingCart,
  Clapperboard,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "image-generation": <Palette className="h-4 w-4" />,
  "video-generation": <Video className="h-4 w-4" />,
  education: <BookOpen className="h-4 w-4" />,
  marketing: <Megaphone className="h-4 w-4" />,
  "social-media": <Share2 className="h-4 w-4" />,
  posters: <Layers className="h-4 w-4" />,
  infographics: <BarChart3 className="h-4 w-4" />,
  storyboards: <Film className="h-4 w-4" />,
  business: <ShoppingCart className="h-4 w-4" />,
  "ai-tools": <Brain className="h-4 w-4" />,
  coding: <Code className="h-4 w-4" />,
  documents: <FileStack className="h-4 w-4" />,
  cinematic: <Clapperboard className="h-4 w-4" />,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const mainNav = [
    { href: "/dashboard", label: t("dashboard"), icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/prompts", label: t("allPrompts"), icon: <FileText className="h-5 w-5" /> },
    { href: "/prompts/new", label: t("addPrompt"), icon: <Plus className="h-5 w-5" /> },
    { href: "/import", label: t("importPrompts"), icon: <Upload className="h-5 w-5" /> },
  ];

  const secondaryNav = [
    { href: "/favorites", label: t("favorites"), icon: <Star className="h-5 w-5" /> },
    { href: "/collections", label: t("collections"), icon: <FolderOpen className="h-5 w-5" /> },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PG</span>
            </div>
            <span className="font-bold text-lg">Prompt Gallery</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        <div className="pt-4 pb-2">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t("categories")}
            </p>
          )}
        </div>

        {Object.entries(categoryIcons).map(([slug, icon]) => (
          <Link
            key={slug}
            href={`/categories/${slug}`}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === `/categories/${slug}`
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            title={collapsed ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : undefined}
          >
            {icon}
            {!collapsed && (
              <span className="capitalize">{slug.replace(/-/g, " ")}</span>
            )}
          </Link>
        ))}

        <div className="pt-4 pb-2">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t("collections")}
            </p>
          )}
        </div>

        {secondaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t p-3 space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          title={collapsed ? t("settings") : undefined}
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span>{t("settings")}</span>}
        </Link>
      </div>
    </aside>
  );
}
