import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Building2, Terminal, Users, PlusCircle } from "lucide-react";

export default async function OrganizerDashboard() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  // Securely verify role on the server
  const user = await prisma.user.findUnique({
    where: { clerk_user_id: userId }
  });

  if (user?.role !== "ORGANIZER" && user?.role !== "ADMIN") {
    redirect("/hub");
  }

  // Fetch hackathons created by this organizer (Optional: if we add organizer_id to Hackathon later)
  // For now we'll just show a placeholder dashboard

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C6FF00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6FF00]/10 border border-[#C6FF00]/20 text-[#C6FF00] text-sm font-bold uppercase tracking-wider mb-4">
              <Building2 className="w-4 h-4" /> Organizer Workspace
            </div>
            <h1 className="text-4xl font-black text-white">Your Command Center</h1>
            <p className="text-gray-400 mt-2">Manage your hackathons, review submissions, and evaluate talent.</p>
          </div>
          
          <button className="bg-[#C6FF00] text-black font-bold py-3 px-6 rounded-xl hover:shadow-[0_0_20px_rgba(198,255,0,0.3)] transition-all flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> Draft New Hackathon
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stats Cards */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <Terminal className="w-8 h-8 text-[#C6FF00] mb-4" />
            <div className="text-3xl font-black text-white mb-1">0</div>
            <div className="text-sm text-gray-500 font-mono uppercase">Active Hackathons</div>
          </div>
          
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <Users className="w-8 h-8 text-[#C6FF00] mb-4" />
            <div className="text-3xl font-black text-white mb-1">0</div>
            <div className="text-sm text-gray-500 font-mono uppercase">Total Builders Engaged</div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-16 text-center">
          <Building2 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Host?</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">You haven't created any hackathons yet. Draft your first event to start accepting registrations.</p>
          <button className="bg-white/5 border border-white/10 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/10 transition-all">
            Read Organizer Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}
