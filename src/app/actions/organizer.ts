"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function submitOrganizerApplication(formData: FormData) {
  const { userId } = auth();
  
  if (!userId) {
    return { error: "You must be logged in to apply." };
  }

  const companyName = formData.get("companyName") as string;
  const website = formData.get("website") as string;
  const description = formData.get("description") as string;

  if (!companyName || !description) {
    return { error: "Company Name and Description are required." };
  }

  try {
    // Ensure the user exists in our DB first
    const dbUser = await prisma.user.findUnique({
      where: { clerk_user_id: userId },
    });

    if (!dbUser) {
      return { error: "Profile not found. Please complete onboarding first." };
    }

    // Check if they already have a pending application
    const existingApp = await prisma.organizerApplication.findFirst({
      where: { 
        user_id: dbUser.id,
        status: "PENDING"
      }
    });

    if (existingApp) {
      return { error: "You already have a pending application." };
    }

    await prisma.organizerApplication.create({
      data: {
        company_name: companyName,
        website: website || null,
        description,
        user_id: dbUser.id,
        status: "PENDING",
      },
    });

    revalidatePath("/apply-to-host");
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting application:", error);
    return { error: "Failed to submit application. Please try again." };
  }
}
