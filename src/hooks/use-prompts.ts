"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { Prompt, Collection } from "@/types";
import toast from "react-hot-toast";

export function usePrompts() {
  const [prompts, setPrompts] = React.useState<Prompt[]>([]);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClient();

  const fetchPrompts = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  React.useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const addPrompt = async (promptData: Partial<Prompt>): Promise<Prompt | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("prompts")
        .insert([{ ...promptData, user_id: user.id }])
        .select()
        .single();
      if (error) throw error;
      setPrompts((prev) => [data, ...prev]);
      return data;
    } catch (error) {
      console.error("Error adding prompt:", error);
      toast.error("Failed to save prompt");
      return null;
    }
  };

  const updatePrompt = async (id: string, promptData: Partial<Prompt>) => {
    try {
      const { error } = await supabase
        .from("prompts")
        .update({ ...promptData, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...promptData } : p))
      );
      return true;
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast.error("Failed to update prompt");
      return false;
    }
  };

  const deletePrompt = async (id: string) => {
    try {
      const { error } = await supabase.from("prompts").delete().eq("id", id);
      if (error) throw error;
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Prompt deleted!");
      return true;
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast.error("Failed to delete prompt");
      return false;
    }
  };

  const toggleFavorite = async (id: string, favorite: boolean) => {
    try {
      const { error } = await supabase
        .from("prompts")
        .update({ favorite })
        .eq("id", id);
      if (error) throw error;
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, favorite } : p))
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const incrementUsage = async (id: string) => {
    try {
      await supabase.rpc("increment_usage", { prompt_id: id });
    } catch (error) {
      console.error("Error incrementing usage:", error);
    }
  };

  const duplicatePrompt = async (prompt: Prompt) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const newPrompt: Omit<Prompt, "id"> = {
        user_id: prompt.user_id,
        title: `${prompt.title} — Copy`,
        description: prompt.description,
        prompt: prompt.prompt,
        image_url: prompt.image_url,
        category: prompt.category,
        subcategory: prompt.subcategory,
        ai_model: prompt.ai_model,
        language: prompt.language,
        tags: prompt.tags,
        favorite: false,
        usage_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("prompts")
        .insert([{ ...newPrompt, user_id: user.id }])
        .select()
        .single();
      if (error) throw error;
      setPrompts((prev) => [data, ...prev]);
      toast.success("Prompt duplicated!");
      return data;
    } catch (error) {
      console.error("Error duplicating prompt:", error);
      toast.error("Failed to duplicate prompt");
      return null;
    }
  };

  return {
    prompts,
    loading,
    fetchPrompts,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    incrementUsage,
    duplicatePrompt,
  };
}

export function useCollections() {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClient();

  const fetchCollections = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  React.useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const addCollection = async (name: string, description: string, icon: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("collections")
        .insert([{ name, description, icon, user_id: user.id }])
        .select()
        .single();
      if (error) throw error;
      setCollections((prev) => [data, ...prev]);
      toast.success("Collection created!");
      return data;
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error("Failed to create collection");
      return null;
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const { error } = await supabase.from("collections").delete().eq("id", id);
      if (error) throw error;
      setCollections((prev) => prev.filter((c) => c.id !== id));
      toast.success("Collection deleted!");
      return true;
    } catch (error) {
      console.error("Error deleting collection:", error);
      return false;
    }
  };

  return {
    collections,
    loading,
    fetchCollections,
    addCollection,
    deleteCollection,
  };
}

export function useUploadImage() {
  const supabase = createClient();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("prompt-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("prompt-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  return { uploadImage };
}
