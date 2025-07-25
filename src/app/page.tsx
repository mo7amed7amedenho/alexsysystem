"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Avatar } from "antd";
import { Alexandria } from "next/font/google";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const alexandriaFont = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin"],
});

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user]);

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.message || "كلمة المرور غير صحيحة");
      }
    } catch (err) {
      setError("حدث خطأ أثناء التحقق");
    }

    setLoading(false);
  };

  if (!isLoaded || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-muted" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col min-h-screen w-full items-center justify-center overflow-hidden px-4 ${alexandriaFont.className}`}
      dir="rtl"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute top-0 left-1/2 h-[150%] w-[150%] -translate-x-1/2 blur-[120px] opacity-40"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="400" cy="400" r="400" fill="#22c55e" />
          <circle cx="200" cy="600" r="200" fill="#16a34a" />
          <circle cx="600" cy="200" r="180" fill="#15803d" />
        </svg>
      </div>
      <Card className="w-full !opacity-90 max-w-md shadow-md !p-4 border rounded-xl">
        <CardHeader className="flex items-center justify-center space-x-1 border-b">
          <Image
            src="https://alexasfor.com/wp-content/uploads/2023/03/Alex.png"
            alt="logo"
            width={120}
            height={120}
          />
          <div>
            <h2 className="text-lg text-green-700">
              اليكس للمستلزمات الزراعية
            </h2>
            <p className="text-sm text-muted-foreground">
              Alex for Agriculture Tools
            </p>
            <p className="text-sm text-muted-foreground">نظام إدارة الشركة</p>
          </div>
        </CardHeader>
        <CardHeader className="text-center flex flex-col items-center">
          <Avatar
            src={user.imageUrl}
            alt={user.firstName || "User Avatar"}
            className="mx-auto mb-4"
            size={100}
          />
          <CardTitle className="text-2xl text-green-700 font-bold">
            مرحباً بعودتك, {user.firstName}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              برجاء إدخال كلمة المرور
            </label>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-right"
                dir="rtl"
                placeholder="كلمة المرور"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 px-3 text-muted-foreground hover:text-foreground focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            className="w-full cursor-pointer !rounded-md bg-green-700 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 px-3.5 py-2 text-sm font-medium text-white shadow transition disabled:opacity-50"
            variant="default"
            size="lg"
            onClick={handleVerify}
            disabled={password.length < 8 || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري التحقق من البيانات...
              </>
            ) : (
              <div className="flex items-center justify-center text-white">
                تأكيد الدخول
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
      {error && (
        <Alert
          variant="default"
          className="mt-4 w-full max-w-md !border-red-700"
        >
          <AlertDescription className="!text-red-700 flex items-center ">
            <AlertCircle className="inline mr-2" />
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
