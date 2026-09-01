"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    allPrompts: "All Prompts",
    categories: "Categories",
    collections: "Collections",
    favorites: "Favorites",
    recent: "Recently Added",
    settings: "Settings",
    addPrompt: "Add Prompt",
    search: "Search prompts...",
    totalPrompts: "Total Prompts",
    totalCategories: "Total Categories",
    totalImages: "Total Images",
    totalFavorites: "Total Favorites",
    recentPrompts: "Recent Prompts",
    mostUsed: "Most Used Prompts",
    copyPrompt: "Copy Prompt",
    viewDetails: "View Details",
    edit: "Edit",
    delete: "Delete",
    duplicate: "Duplicate",
    download: "Download",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",
    title: "Title",
    description: "Description",
    prompt: "Prompt",
    category: "Category",
    subcategory: "Subcategory",
    aiModel: "AI Model",
    language: "Language",
    tags: "Tags",
    save: "Save",
    cancel: "Cancel",
    uploadImage: "Upload Image",
    dragDrop: "Drag & drop or click to upload",
    copiedToClipboard: "Copied to clipboard!",
    promptSaved: "Prompt saved successfully!",
    promptDeleted: "Prompt deleted!",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    profile: "Profile",
    logout: "Logout",
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    noPrompts: "No prompts yet",
    noResults: "No results found",
    importPrompts: "Import Prompts",
    exportPrompts: "Export Prompts",
    createCollection: "Create Collection",
    collectionName: "Collection Name",
    sortBy: "Sort by",
    newest: "Newest",
    oldest: "Oldest",
    alphabetical: "Alphabetical",
    recentlyUpdated: "Recently Updated",
    filters: "Filters",
    clearFilters: "Clear Filters",
    version: "Version",
    versionHistory: "Version History",
    noPreviewImage: "No Preview Image",
    generatePreview: "Generate Preview",
    explorePrompts: "Explore Prompts",
    heroTitle: "YOUR AI PROMPTS. ORGANIZED VISUALLY.",
    heroSubtitle: "Store, organize, discover and reuse your best AI prompts — each one with its own visual preview.",
    recentlyAdded: "Recently Added",
    mostUsedPrompts: "Most Used Prompts",
    viewAll: "View All",
    quickActions: "Quick Actions",
    newPrompt: "New Prompt",
    import: "Import",
    export: "Export",
  },
  ar: {
    dashboard: "لوحة التحكم",
    allPrompts: "جميع البرومبتات",
    categories: "الفئات",
    collections: "المجموعات",
    favorites: "المفضلة",
    recent: "الأحدث",
    settings: "الإعدادات",
    addPrompt: "إضافة برومبت",
    search: "البحث في البرومبتات...",
    totalPrompts: "إجمالي البرومبتات",
    totalCategories: "إجمالي الفئات",
    totalImages: "إجمالي الصور",
    totalFavorites: "إجمالي المفضلة",
    recentPrompts: "البرومبتات الأخيرة",
    mostUsed: "الأكثر استخداماً",
    copyPrompt: "نسخ البرومبت",
    viewDetails: "عرض التفاصيل",
    edit: "تعديل",
    delete: "حذف",
    duplicate: "تكرار",
    download: "تحميل",
    addToFavorites: "إضافة للمفضلة",
    removeFromFavorites: "إزالة من المفضلة",
    title: "العنوان",
    description: "الوصف",
    prompt: "البرومبت",
    category: "الفئة",
    subcategory: "الفئة الفرعية",
    aiModel: "نموذج الذكاء الاصطناعي",
    language: "اللغة",
    tags: "الوسوم",
    save: "حفظ",
    cancel: "إلغاء",
    uploadImage: "رفع صورة",
    dragDrop: "اسحب وأفلت أو انقر للرفع",
    copiedToClipboard: "تم النسخ!",
    promptSaved: "تم حفظ البرومبت!",
    promptDeleted: "تم حذف البرومبت!",
    lightMode: "الوضع الفاتح",
    darkMode: "الوضع الداكن",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    fullName: "الاسم الكامل",
    noPrompts: "لا توجد برومبتات بعد",
    noResults: "لا توجد نتائج",
    importPrompts: "استيراد برومبتات",
    exportPrompts: "تصدير برومبتات",
    createCollection: "إنشاء مجموعة",
    collectionName: "اسم المجموعة",
    sortBy: "ترتيب حسب",
    newest: "الأحدث",
    oldest: "الأقدم",
    alphabetical: "أبجدي",
    recentlyUpdated: "الأحدث تعديلاً",
    filters: "الفلاتر",
    clearFilters: "مسح الفلاتر",
    version: "الإصدار",
    versionHistory: "سجل الإصدارات",
    noPreviewImage: "لا توجد صورة معاينة",
    generatePreview: "إنشاء معاينة",
    explorePrompts: "استكشف البرومبتات",
    heroTitle: "برومبتاتك للذكاء الاصطناعي. منظمة بصرياً.",
    heroSubtitle: "خزّن ونظّم واكتشف وأعد استخدام أفضل برومبتاتك — كل واحد مع صورته المرئية.",
    recentlyAdded: "الأحدث إضافة",
    mostUsedPrompts: "البرومبتات الأكثر استخداماً",
    viewAll: "عرض الكل",
    quickActions: "إجراءات سريعة",
    newPrompt: "برومبت جديد",
    import: "استيراد",
    export: "تصدير",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved) setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction: language === "ar" ? "rtl" : "ltr",
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
