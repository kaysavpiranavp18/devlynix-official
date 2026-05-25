"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function submitOrganizerApplication(formData: FormData) {
  const { userId } = await auth();
  
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

export async function submitHackathonRequest(formData: FormData): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be logged in to submit a hackathon request.");
  }

  const title = formData.get("title") as string;
  const organizationName = formData.get("organizationName") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const theme = formData.get("theme") as string;
  const mode = formData.get("mode") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const prizePool = formData.get("prizePool") as string;
  const maxTeamSizeRaw = formData.get("maxTeamSize") as string;

  function parseDateInput(value: string) {
    const [yearText, monthText, dayText] = value.split("-");
    const year = Number.parseInt(yearText, 10);
    const month = Number.parseInt(monthText, 10);
    const day = Number.parseInt(dayText, 10);

    if (
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      Number.isNaN(day) ||
      year < 1970 ||
      year > 9999 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return null;
    }

    return new Date(Date.UTC(year, month - 1, day));
  }

  if (!title || !organizationName || !startDate || !endDate) {
    throw new Error("Title, organization name, start date, and end date are required.");
  }

  const parsedStartDate = parseDateInput(startDate);
  const parsedEndDate = parseDateInput(endDate);
  const parsedMaxTeamSize = maxTeamSizeRaw ? Number.parseInt(maxTeamSizeRaw, 10) : 4;

  if (!parsedStartDate || !parsedEndDate) {
    throw new Error("Please provide valid start and end dates.");
  }

  if (parsedEndDate <= parsedStartDate) {
    throw new Error("End date must be after the start date.");
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerk_user_id: userId },
      select: { id: true, role: true },
    });

    if (!dbUser) {
      throw new Error("Profile not found. Please complete onboarding first.");
    }

    if (dbUser.role !== "ORGANIZER" && dbUser.role !== "ADMIN") {
      throw new Error("Only organizers can submit hackathon requests.");
    }

    await prisma.hackathon.create({
      data: {
        title,
        organization_name: organizationName,
        requested_by_id: dbUser.id,
        tagline: tagline || null,
        description: description || null,
        theme: theme || null,
        mode: mode || "Online",
        start_date: parsedStartDate,
        end_date: parsedEndDate,
        prize_pool: prizePool || null,
        max_team_size: Number.isNaN(parsedMaxTeamSize) ? 4 : parsedMaxTeamSize,
        approval_status: "PENDING",
        is_featured: false,
      },
    });

    revalidatePath("/organizer");
    revalidatePath("/admin/hackathons");
  } catch (error: any) {
    console.error("Error submitting hackathon request:", error);
    throw new Error("Failed to submit hackathon request. Please try again.");
  }
}
