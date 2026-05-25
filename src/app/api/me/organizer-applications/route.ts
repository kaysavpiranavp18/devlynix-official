import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ applications: [] }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerk_user_id: userId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ applications: [] }, { status: 404 });
  }

  const applications = await prisma.organizerApplication.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      company_name: true,
      website: true,
      description: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });

  return NextResponse.json({ applications });
}