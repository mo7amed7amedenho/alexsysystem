"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Image from "next/image";
import { Alexandria } from "next/font/google";
import { Spin } from "antd";

const alexandriaFont = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin"],
});

export default function SignInPage() {
  return (
    <div
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 ${alexandriaFont.className}  transition-colors duration-300`}
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

      {/* الفورم */}
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="w-full sm:w-96 space-y-6 rounded-2xl px-6 py-10 shadow-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md bg-zinc-100/85 dark:bg-zinc-900/85 transition"
        >
          {/* رأس الصفحة */}
          <header className="text-center border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
            <div className="flex justify-center items-center gap-3">
              <Image
                src="https://alexasfor.com/wp-content/uploads/2023/03/Alex.png"
                alt="logo"
                width={100}
                height={100}
              />
              <div className="flex flex-col text-right">
                <p className="text-sm font-bold text-green-700 dark:text-green-400">
                  أليكس للمستلزمات الزراعية
                </p>
                <p className="text-sm text-muted-foreground">
                  Alex for Agriculture Tools
                </p>
                <p className="text-xs text-muted-foreground">
                  نظام إدارة الشركة
                </p>
              </div>
            </div>
            <h1 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              تسجيل الدخول
            </h1>
          </header>

          {/* الأخطاء العامة */}
          <Clerk.GlobalError className="block text-sm text-red-500" />

          {/* الحقول */}
          <div className="space-y-4">
            <Clerk.Field name="identifier" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                البريد الإلكتروني
              </Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="w-full rounded-md bg-white dark:bg-zinc-800 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:ring-zinc-400 dark:hover:ring-zinc-500 focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400 data-[invalid]:ring-red-500"
              />
              <Clerk.FieldError className="block text-sm text-red-500" />
            </Clerk.Field>

            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                كلمة المرور
              </Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-md bg-white dark:bg-zinc-800 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:ring-zinc-400 dark:hover:ring-zinc-500 focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400 data-[invalid]:ring-red-500"
              />
              <Clerk.FieldError className="block text-sm text-red-500" />
            </Clerk.Field>
          </div>

          {/* زر الدخول */}
          <SignIn.Action
            submit
            className="w-full rounded-md bg-green-700 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 px-3.5 py-2 text-sm font-medium text-white shadow transition disabled:opacity-50"
          >
            <Clerk.Loading>
              {(isLoading) =>
                isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spin size="small" />
                    <span>جاري التحقق من البيانات ...</span>
                  </div>
                ) : (
                  "تسجيل الدخول"
                )
              }
            </Clerk.Loading>
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}
