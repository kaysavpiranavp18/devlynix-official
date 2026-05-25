import { prisma } from "@/lib/prisma";
import HackathonsClient from "./HackathonsClient";

export const dynamic = "force-dynamic";

export default async function HackathonsPage() {
  const hackathons = await prisma.hackathon.findMany({
    where: {
      approval_status: "APPROVED"
    },
    orderBy: [
      { is_featured: "desc" },
      { created_at: "desc" }
    ]
  });

  return <HackathonsClient initialHackathons={hackathons} />;
}
