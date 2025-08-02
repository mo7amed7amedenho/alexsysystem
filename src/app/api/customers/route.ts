import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // التحقق من الصلاحيات
    const permissions = (user.publicMetadata.permissions as string[]) || [];
    if (!permissions.includes("crm.manage")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to manage customers" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // التحقق من صحة البيانات
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // إنشاء العميل
    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address || null,
        department: Array.isArray(body.department)
          ? body.department.join(",")
          : "",
        userId: user.id,
        userCreated:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0]?.emailAddress,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("[CUSTOMERS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany();
    return NextResponse.json(customers);
  } catch (error) {
    console.error("[CUSTOMERS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
