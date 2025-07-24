"use server";

import { clerkClient } from "@clerk/nextjs/server";
// import { prisma } from "@/lib/prisma";

export async function createUser({
  email,
  firstName,
  lastName,
  role,
  department,
  permissions,
  warehouses,
  password, // if you want to set a password
}: {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  permissions: string[];
  warehouses: string[];
  password: string; // optional, if you want to set a password
}) {
  // 👇 هنا التعديل
  const clerk = await clerkClient();

  const existing = await clerk.users.getUserList({ emailAddress: [email] });

  if (existing.data.length > 0) {
    throw new Error("المستخدم مسجل من قبل");
  }

  const user = await clerk.users.createUser({
    emailAddress: [email],
    firstName: firstName,
    lastName: lastName,
    publicMetadata: {
      role,
      department,
      permissions,
      warehouses: warehouses.length > 0 ? warehouses : "all",
    },
    password, // إذا كنت تريد تعيين كلمة مرور
  });

  // if (role.toLowerCase().includes("مندوب")) {
  //   await prisma.warehouse.create({
  //     data: {
  //       name: `مخزن - ${name}`,
  //       ownerClerkId: user.id,
  //     },
  //   });
  // }
}
