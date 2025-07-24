// src/components/blocks/user-menu.tsx
"use client";

import { UserButton } from "@clerk/nextjs";

export default function UserMenu() {
  return (
    <div className="flex items-center gap-2">
      <UserButton afterSignOutUrl="/sign-in" />
    </div>
  );
}
