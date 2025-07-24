"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Image from "next/image";
import { Alexandria } from "next/font/google";

const alexandriaFont = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin"],
});

export default function SignInPage() {
  return (
    <div
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 ${alexandriaFont.className}`}
      dir="rtl"
    >
      {/* خلفية متحركة SVG دوائر */}
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
          className="w-full space-y-4 rounded-2xl bg-white/90 px-2 py-10 shadow-xl backdrop-blur-lg ring-1 ring-black/10 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <div className="flex justify-center items-center gap-2">
              <Image
                src="https://alexasfor.com/wp-content/uploads/2023/03/Alex.png"
                alt="logo"
                width={100}
                height={100}
              />
              <div className="flex flex-col text-right">
                <p className="text-sm font-bold text-green-700">
                 أليكس للمستلزمات الزراعية
                </p>
                <p className="text-xs text-muted-foreground">
                  Alex for Agriculture Tools
                </p>
                <p className="text-xs text-muted-foreground">
                    نظام إدارة الشركة
                </p>
              </div>
            </div>
            <h1 className="mt-4 text-xl font-medium tracking-tight text-green-800">
              تسجيل الدخول
            </h1>
          </header>

          <Clerk.GlobalError className="block text-sm text-red-400" />

          <div className="space-y-4">
            <Clerk.Field name="identifier" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-green-800">
                البريد الإلكتروني
              </Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-2 focus:ring-green-700 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>

            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-green-800">
                كلمة المرور
              </Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-2 focus:ring-green-700 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </div>

          <SignIn.Action
            submit
            className="w-full rounded-md bg-green-700 px-3.5 py-1.5 text-sm font-medium text-white shadow hover:bg-green-600 transition"
          >
            دخول
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}
