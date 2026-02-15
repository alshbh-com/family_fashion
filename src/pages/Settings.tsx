import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, Palette } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { themePresets, templatePresets } from "@/lib/themePresets";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, login, logout } = useAdminAuth();
  const { activeTheme, activeTemplate, setTheme, setTemplate } = useTheme();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("أدخل كلمة المرور");
      return;
    }
    setLoading(true);
    const success = await login(password);
    setLoading(false);

    if (success) {
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/admin");
    } else {
      toast.error("كلمة المرور خاطئة");
      setPassword("");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 p-4 space-y-6">
      {/* Login / Logout Card */}
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          {currentUser ? (
            <>
              <CardHeader>
                <CardTitle className="text-center">الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  مرحباً {currentUser.username}
                </p>
                <Button onClick={() => navigate("/admin")} className="w-full">
                  الذهاب إلى لوحة التحكم
                </Button>
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  تسجيل الخروج
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-center">تسجيل الدخول</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-center pr-10"
                      disabled={loading}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "جاري التحقق..." : "دخول"}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>

      {/* Theme Selection - visible to everyone */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              الثيمات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {themePresets.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    activeTheme === theme.id
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: `hsl(${theme.light['--primary']})` }}
                  />
                  <span className="text-xs font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Selection - visible to admins */}
      {currentUser && (
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>قوالب التصميم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {templatePresets.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplate(tmpl.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      activeTemplate === tmpl.id
                        ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-sm font-medium block">{tmpl.name}</span>
                    <span className="text-xs text-muted-foreground mt-1 block">{tmpl.description}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;
