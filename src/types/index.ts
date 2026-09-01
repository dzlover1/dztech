export interface Prompt {
  id: string;
  user_id: string;
  title: string;
  description: string;
  prompt: string;
  image_url: string | null;
  category: string;
  subcategory: string;
  ai_model: string;
  language: string;
  tags: string[];
  favorite: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface PromptVersion {
  id: string;
  prompt_id: string;
  version: number;
  title: string;
  description: string;
  prompt: string;
  image_url: string | null;
  ai_model: string;
  tags: string[];
  changes: string;
  created_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
  prompt_count?: number;
}

export interface CollectionPrompt {
  collection_id: string;
  prompt_id: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  language: string;
  theme: string;
  created_at: string;
}

export type SortOption = 'newest' | 'oldest' | 'most_used' | 'most_favorited' | 'alphabetical' | 'recently_updated';

export type AIOModel =
  | 'ChatGPT'
  | 'Gemini'
  | 'Gemini Image'
  | 'Veo'
  | 'Sora'
  | 'Midjourney'
  | 'Flux'
  | 'Claude'
  | 'Canva'
  | 'Adobe Firefly'
  | 'Leonardo'
  | 'Other';

export const AI_MODELS: AIOModel[] = [
  'ChatGPT', 'Gemini', 'Gemini Image', 'Veo', 'Sora',
  'Midjourney', 'Flux', 'Claude', 'Canva', 'Adobe Firefly',
  'Leonardo', 'Other'
];

export const CATEGORIES = [
  { slug: 'image-generation', name: 'Image Generation', nameAr: 'توليد الصور', icon: '🎨', color: '#8B5CF6' },
  { slug: 'video-generation', name: 'Video Generation', nameAr: 'توليد الفيديو', icon: '🎬', color: '#EF4444' },
  { slug: 'education', name: 'Education', nameAr: 'التعليم', icon: '📚', color: '#3B82F6' },
  { slug: 'marketing', name: 'Marketing', nameAr: 'التسويق', icon: '📢', color: '#F59E0B' },
  { slug: 'social-media', name: 'Social Media', nameAr: 'وسائل التواصل', icon: '📱', color: '#10B981' },
  { slug: 'posters', name: 'Posters', nameAr: 'الملصقات', icon: '🖼️', color: '#EC4899' },
  { slug: 'infographics', name: 'Infographics', nameAr: 'إنفوجرافيك', icon: '📊', color: '#06B6D4' },
  { slug: 'storyboards', name: 'Storyboards', nameAr: 'لقطات القصة', icon: '🎞️', color: '#8B5CF6' },
  { slug: 'business', name: 'Business', nameAr: 'الأعمال', icon: '🏢', color: '#64748B' },
  { slug: 'ai-tools', name: 'AI Tools', nameAr: 'أدوات الذكاء الاصطناعي', icon: '🧠', color: '#7C3AED' },
  { slug: 'coding', name: 'Coding', nameAr: 'البرمجة', icon: '💻', color: '#059669' },
  { slug: 'documents', name: 'Documents', nameAr: 'المستندات', icon: '📄', color: '#D97706' },
  { slug: 'cinematic', name: 'Cinematic', nameAr: 'سينمائي', icon: '🎥', color: '#DC2626' },
  { slug: 'product-advertising', name: 'Product Advertising', nameAr: 'إعلان المنتجات', icon: '🛒', color: '#EA580C' },
  { slug: 'other', name: 'Other', nameAr: 'أخرى', icon: '📁', color: '#6B7280' },
];

export const LANGUAGES = [
  { code: 'en', name: 'English', nameAr: 'الإنجليزية' },
  { code: 'ar', name: 'Arabic', nameAr: 'العربية' },
  { code: 'fr', name: 'French', nameAr: 'الفرنسية' },
  { code: 'es', name: 'Spanish', nameAr: 'الإسبانية' },
  { code: 'de', name: 'German', nameAr: 'الألمانية' },
  { code: 'tr', name: 'Turkish', nameAr: 'التركية' },
  { code: 'hi', name: 'Hindi', nameAr: 'الهندية' },
  { code: 'zh', name: 'Chinese', nameAr: 'الصينية' },
  { code: 'ja', name: 'Japanese', nameAr: 'اليابانية' },
  { code: 'other', name: 'Other', nameAr: 'أخرى' },
];
