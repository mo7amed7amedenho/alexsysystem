import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "../ui/ThemeToggle";
import { UserButton, SignedIn } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import UserMenu from "./user-menu";

interface User {
  firstName?: string;
  publicMetadata?: {
    role?: string;
  };
}
export async function SiteHeader() {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId) {
    return null;
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 justify-between">
        <div className="flex justify-center items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex flex-col items-start">
            <h1 className="text-sm font-semibold">
              مرحبا بك, {user?.firstName || "المستخدم"}!
            </h1>
            <p className="text-sm text-muted-foreground">
              {String(user?.publicMetadata?.role ?? "غير محدد")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <SignedIn>
            <UserButton />
          </SignedIn> */}
          <UserMenu />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
