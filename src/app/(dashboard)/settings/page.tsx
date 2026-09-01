"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/providers/language-provider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Sun, Moon, Globe, Download, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { usePrompts } from "@/hooks/use-prompts";
import { downloadFile } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const supabase = createClient();
  const { prompts } = usePrompts();

  const [user, setUser] = React.useState<{ email?: string } | null>(null);
  const [fullName, setFullName] = React.useState("");

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setFullName(data.user?.user_metadata?.full_name || "");
    });
  }, [supabase]);

  const handleSaveProfile = async () => {
    await supabase.auth.updateUser({ data: { full_name: fullName } });
    toast.success("Profile updated!");
  };

  const handleExport = () => {
    downloadFile(JSON.stringify(prompts, null, 2), "prompt-gallery-export.json", "application/json");
    toast.success("Exported prompts!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t("settings")}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("fullName")}</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <Button onClick={handleSaveProfile}>{t("save")}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-5 w-5" />
            Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={language === "en" ? "default" : "outline"}
              onClick={() => setLanguage("en")}
            >
              English
            </Button>
            <Button
              variant={language === "ar" ? "default" : "outline"}
              onClick={() => setLanguage("ar")}
            >
              العربية
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4 mr-1" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4 mr-1" />
              Dark
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download className="h-5 w-5" />
            Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export all prompts (JSON)
          </Button>
          <p className="text-xs text-muted-foreground">
            {prompts.length} prompts in your library
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            <LogOut className="h-4 w-4 mr-1" />
            {t("logout")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
