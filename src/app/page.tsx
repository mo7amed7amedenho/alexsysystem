// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const tryAuth = await auth();
  const { userId } = await tryAuth;

  if (userId) {
    redirect("/dashboard");
  } else {
    redirect("/sign-in");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold"> Loading...</h1>
    </div>
  );
}
