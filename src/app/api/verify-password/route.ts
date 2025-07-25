// app/api/verify-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    return NextResponse.json({ message: "غير مسجل دخول" }, { status: 401 });
  }

  try {
    const clerkClientInstance = await clerkClient();
    const result = await clerkClientInstance.users.verifyPassword({
      userId,
      password,
    });

    if (result.verified) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json(
        { message: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { message: "فشل التحقق من كلمة المرور", error: err?.message || err },
      { status: 500 }
    );
  }
}
