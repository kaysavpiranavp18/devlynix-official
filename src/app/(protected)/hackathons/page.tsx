import { prisma } from "@/lib/prisma";
import HackathonsClient from "./HackathonsClient";

export default async function HackathonsPage() {
  // Fetch only APPROVED hackathons
  // Sort them so that is_featured == true comes first, then by creation date
  const approvedHackathons = await prisma.hackathon.findMany({
    where: {
      approval_status: "APPROVED"
    },
    orderBy: [
      { is_featured: "desc" },
      { created_at: "desc" }
    ]
  });

  return <HackathonsClient initialHackathons={approvedHackathons} />;
}
