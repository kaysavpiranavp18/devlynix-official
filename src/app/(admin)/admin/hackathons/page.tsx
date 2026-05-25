import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Terminal, Star, CheckCircle, XCircle, Clock3, Building2, CalendarDays, Trophy } from "lucide-react";
import { revalidatePath } from "next/cache";
import { HackathonStatusSelect } from "./HackathonStatusSelect";

// Server Actions
async function toggleFeatured(formData: FormData) {
  "use server";
  const { userId: adminId } = await auth();
  if (!adminId) throw new Error("Unauthorized");
  
  const admin = await prisma.user.findUnique({ where: { clerk_user_id: adminId } });
  if (admin?.role !== "ADMIN") throw new Error("Forbidden");

  const hackathonId = formData.get("hackathonId") as string;
  const currentFeatured = formData.get("currentFeatured") === "true";

  await prisma.hackathon.update({
    where: { id: hackathonId },
    data: { is_featured: !currentFeatured }
  });

  revalidatePath("/admin/hackathons");
}

async function updateStatus(formData: FormData) {
  "use server";
  const { userId: adminId } = await auth();
  if (!adminId) throw new Error("Unauthorized");
  
  const admin = await prisma.user.findUnique({ where: { clerk_user_id: adminId } });
  if (admin?.role !== "ADMIN") throw new Error("Forbidden");

  const hackathonId = formData.get("hackathonId") as string;
  const newStatus = formData.get("status") as string;

  await prisma.hackathon.update({
    where: { id: hackathonId },
    data: { approval_status: newStatus }
  });

  revalidatePath("/admin/hackathons");
}

function HackathonCard({
  h,
  showFeaturedToggle,
  showStatusActions,
}: {
  h: any;
  showFeaturedToggle: boolean;
  showStatusActions: boolean;
}) {
  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#C6FF00]/30 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider ${
              h.approval_status === 'APPROVED' ? 'bg-emerald-900/20 text-emerald-500' :
              h.approval_status === 'PENDING' ? 'bg-amber-900/20 text-amber-500' :
              'bg-red-900/20 text-red-500'
            }`}>
              {h.approval_status}
            </span>
            {h.is_featured && (
              <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider bg-[#C6FF00]/10 text-[#C6FF00]">
                FEATURED
              </span>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{h.title}</h3>
            {h.tagline && <p className="text-gray-400 text-sm mb-2">{h.tagline}</p>}
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
              <Building2 className="w-3 h-3" /> {h.organization_name}
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-6 max-w-3xl">
            {h.description || 'No description provided.'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
            <div>
              <div className="text-xs text-gray-500 font-mono mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Dates</div>
              <div className="text-xs text-white font-medium leading-5">
                {new Date(h.start_date).toLocaleDateString()}<br />
                {new Date(h.end_date).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-mono mb-1 flex items-center gap-1"><Trophy className="w-3 h-3" /> Prize</div>
              <div className="text-white font-medium text-sm">{h.prize_pool || 'TBA'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-mono mb-1 flex items-center gap-1"><Clock3 className="w-3 h-3" /> Mode</div>
              <div className="text-white font-medium text-sm">{h.mode || 'Online'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-mono mb-1">Team Size</div>
              <div className="text-white font-medium text-sm">Up to {h.max_team_size ?? 4}</div>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col gap-3 lg:items-end">
          {showFeaturedToggle && (
            <form action={toggleFeatured} className="w-full lg:w-auto">
              <input type="hidden" name="hackathonId" value={h.id} />
              <input type="hidden" name="currentFeatured" value={h.is_featured.toString()} />
              <button type="submit" className={`w-full lg:w-auto px-4 py-3 rounded-xl border transition-colors ${
                h.is_featured ? 'text-emerald-400 bg-emerald-900/20 border-emerald-900/40 hover:bg-emerald-900/30' : 'text-gray-300 bg-white/5 border-white/10 hover:bg-white/10'
              }`}>
                <Star className={`w-4 h-4 inline-block mr-2 ${h.is_featured ? 'fill-emerald-400' : ''}`} />
                {h.is_featured ? 'Unfeature' : 'Feature'}
              </button>
            </form>
          )}

          {showStatusActions && (
            <form action={updateStatus} className="flex flex-col gap-2 w-full lg:w-auto">
              <input type="hidden" name="hackathonId" value={h.id} />
              <div className="flex gap-2">
                <button type="submit" name="status" value="APPROVED" className="px-4 py-3 rounded-xl bg-[#C6FF00] text-black font-bold hover:shadow-[0_0_18px_rgba(198,255,0,0.25)] transition-all">
                  Approve
                </button>
                <button type="submit" name="status" value="REJECTED" className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all">
                  Reject
                </button>
              </div>
              <HackathonStatusSelect currentStatus={h.approval_status} />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function AdminHackathonsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const currentUser = await prisma.user.findUnique({ where: { clerk_user_id: userId } });
  if (currentUser?.role !== "ADMIN") redirect("/hub");

  const hackathons = await prisma.hackathon.findMany({
    orderBy: { created_at: "desc" },
  });

  const pendingRequests = hackathons.filter((hackathon) => hackathon.approval_status === "PENDING");
  const approvedHackathons = hackathons.filter((hackathon) => hackathon.approval_status === "APPROVED");
  const rejectedHackathons = hackathons.filter((hackathon) => hackathon.approval_status === "REJECTED");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 border-b border-[#111] pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Hackathon Management</h1>
        <p className="text-gray-500 text-sm mt-1">Review pending host requests, approve them, and manage featured events.</p>
      </div>

      <div className="space-y-10">
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock3 className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white">Pending Host Requests</h2>
            <span className="text-xs font-mono text-amber-500 bg-amber-900/20 px-2 py-1 rounded-full">{pendingRequests.length}</span>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((h) => (
                <HackathonCard key={h.id} h={h} showFeaturedToggle={false} showStatusActions={true} />
              ))}
            </div>
          ) : (
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-10 text-center text-gray-500">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No pending hackathon requests right now.
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-[#C6FF00]" />
            <h2 className="text-xl font-bold text-white">Approved Hackathons</h2>
            <span className="text-xs font-mono text-[#C6FF00] bg-[#C6FF00]/10 px-2 py-1 rounded-full">{approvedHackathons.length}</span>
          </div>

          {approvedHackathons.length > 0 ? (
            <div className="space-y-4">
              {approvedHackathons.map((h) => (
                <HackathonCard key={h.id} h={h} showFeaturedToggle={true} showStatusActions={false} />
              ))}
            </div>
          ) : (
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-10 text-center text-gray-500">
              <Terminal className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No approved hackathons yet.
            </div>
          )}
        </section>

        {rejectedHackathons.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold text-white">Rejected Requests</h2>
              <span className="text-xs font-mono text-red-500 bg-red-900/20 px-2 py-1 rounded-full">{rejectedHackathons.length}</span>
            </div>

            <div className="space-y-4">
              {rejectedHackathons.map((h) => (
                <HackathonCard key={h.id} h={h} showFeaturedToggle={false} showStatusActions={true} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
