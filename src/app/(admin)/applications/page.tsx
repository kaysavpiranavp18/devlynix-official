import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ShieldAlert, Building2, CheckCircle, XCircle, Globe, CalendarDays } from "lucide-react";
import ApplicationRow from "./ApplicationRow";

export default async function AdminApplicationsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Double-check Admin Authorization securely on the server
  const currentUser = await prisma.user.findUnique({
    where: { clerk_user_id: userId }
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 text-white">
        <div className="bg-[#0A0A0A] border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You do not have the required clearance to access the Admin Console.</p>
        </div>
      </div>
    );
  }

  // Fetch all pending applications with user data
  const pendingApplications = await prisma.organizerApplication.findMany({
    where: { status: "PENDING" },
    include: {
      user: true
    },
    orderBy: { created_at: "asc" }
  });

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#C6FF00]/5 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldAlert className="w-3 h-3" /> Admin Console Level 5
            </div>
            <h1 className="text-4xl font-black text-white">Organizer Approvals</h1>
            <p className="text-gray-400 mt-2">Review and verify incoming requests to host hackathons on Devlynix.</p>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-xl px-6 py-4 flex items-center gap-4">
            <div className="p-3 bg-[#C6FF00]/10 rounded-lg">
              <Building2 className="w-6 h-6 text-[#C6FF00]" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{pendingApplications.length}</div>
              <div className="text-xs text-gray-500 font-mono uppercase">Pending Reviews</div>
            </div>
          </div>
        </div>

        {pendingApplications.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-16 text-center">
            <CheckCircle className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-500">There are no pending organizer applications at this time.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingApplications.map((app) => (
              <ApplicationRow key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
