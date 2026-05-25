"use server";

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Verify admin role helper
async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  
  const user = await prisma.user.findUnique({
    where: { clerk_user_id: userId }
  });
  
  return user?.role === "ADMIN";
}

export async function approveOrganizer(applicationId: string, applicantUserId: string, clerkUserId: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized. Admin access required." };
  }

  try {
    // 1. Update Application Status
    await prisma.organizerApplication.update({
      where: { id: applicationId },
      data: { status: "APPROVED" }
    });

    // 2. Update User Role in Prisma
    await prisma.user.update({
      where: { id: applicantUserId },
      data: { role: "ORGANIZER" }
    });

    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        role: "ORGANIZER"
      }
    });

    revalidatePath("/applications");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to approve organizer:", error);
    return { error: "Failed to approve organizer." };
  }
}

export async function rejectOrganizer(applicationId: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized. Admin access required." };
  }

  try {
    await prisma.organizerApplication.update({
      where: { id: applicationId },
      data: { status: "REJECTED" }
    });

    revalidatePath("/applications");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to reject organizer:", error);
    return { error: "Failed to reject organizer." };
  }
}
