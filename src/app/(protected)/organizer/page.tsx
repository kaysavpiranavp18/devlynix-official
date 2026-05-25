import { submitHackathonRequest } from "@/app/actions/organizer";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "APPROVED"
      ? "border-[#C6FF00]/30 bg-[#C6FF00]/10 text-[#C6FF00]"
      : status === "REJECTED"
        ? "border-rose-400/30 bg-rose-500/10 text-rose-300"
        : "border-white/15 bg-white/5 text-gray-300";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${tone}`}>
      {status}
    </span>
  );
}

function SectionCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-5 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.75)] backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-gray-500">{helper}</p>
    </div>
  );
}

function HostRequestForm() {
  return (
    <form
      action={submitHackathonRequest}
      className="grid gap-4 rounded-[2rem] border border-white/10 bg-[#0A0A0A] p-5 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.8)] backdrop-blur"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C6FF00]">New request</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Request a hackathon</h2>
        <p className="mt-2 text-sm text-gray-400">
          Submit the core details here. An admin reviews it before it appears in the public hackathon page.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Title</span>
          <input name="title" required className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#C6FF00]/50" placeholder="Hack-Week 2025" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Organization name</span>
          <input name="organizationName" required className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#C6FF00]/50" placeholder="Devlynix Community" />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm text-gray-300">Tagline</span>
        <input name="tagline" className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#C6FF00]/50" placeholder="Build something people will remember" />
      </label>

      <label className="grid gap-2">
        <span className="text-sm text-gray-300">Description</span>
        <textarea name="description" rows={4} className="rounded-[1.5rem] border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#C6FF00]/50" placeholder="What the hackathon is about, who it is for, and what makes it interesting." />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Theme</span>
          <input name="theme" className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#C6FF00]/50" placeholder="AI, FinTech, HealthTech" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Mode</span>
          <input name="mode" className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#C6FF00]/50" placeholder="Online / Onsite / Hybrid" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Start date</span>
          <input name="startDate" type="date" required className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-[#C6FF00]/50" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-gray-300">End date</span>
          <input name="endDate" type="date" required className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-[#C6FF00]/50" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Prize pool</span>
          <input name="prizePool" className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#C6FF00]/50" placeholder="$10,000 + perks" />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm text-gray-300">Max team size</span>
        <input name="maxTeamSize" type="number" min={1} max={10} defaultValue={4} className="w-32 rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-[#C6FF00]/50" />
      </label>

      <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-[#C6FF00] px-5 py-3 text-sm font-semibold text-black transition hover:shadow-[0_0_22px_rgba(198,255,0,0.25)]">
        Submit request
      </button>
    </form>
  );
}

export default async function OrganizerDashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerk_user_id: userId },
    select: { id: true, role: true },
  });

  if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
    redirect("/hub");
  }

  const hackathonRequests = await prisma.hackathon.findMany({
    where: { requested_by_id: user.id },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      title: true,
      organization_name: true,
      tagline: true,
      theme: true,
      mode: true,
      start_date: true,
      end_date: true,
      prize_pool: true,
      max_team_size: true,
      approval_status: true,
      created_at: true,
    },
  });

  const pendingRequests = hackathonRequests.filter((request) => request.approval_status === "PENDING").length;
  const approvedRequests = hackathonRequests.filter((request) => request.approval_status === "APPROVED").length;
  const rejectedRequests = hackathonRequests.filter((request) => request.approval_status === "REJECTED").length;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#060814] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(198,255,0,0.16),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(198,255,0,0.08),_transparent_24%),linear-gradient(180deg,_#030303_0%,_#060814_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{
        backgroundSize: "40px 40px",
        backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)"
      }} />
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-[#C6FF00]/20 bg-[#C6FF00]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6FF00]">
              Organizer dashboard
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Manage hackathon requests from one place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
              You already have organizer access. This page focuses on the hackathons you submit, their review status, and what is live publicly.
            </p>
          </div>
          <div className="rounded-3xl border border-[#C6FF00]/20 bg-[#0A0A0A] p-5 text-sm text-gray-300 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.75)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6FF00]/80">Access</p>
            <p className="mt-2 text-lg font-semibold text-white">Organizer access active</p>
            <p className="mt-2 text-gray-400">
              Requests are reviewed by admins before they appear on the public hackathons page.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <SectionCard title="Pending requests" value={String(pendingRequests).padStart(2, "0")} helper="Waiting for admin review" />
          <SectionCard title="Approved requests" value={String(approvedRequests).padStart(2, "0")} helper="Published to the public page" />
          <SectionCard title="Rejected requests" value={String(rejectedRequests).padStart(2, "0")} helper="Needs edits or a resubmission" />
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <HostRequestForm />

          <div className="rounded-[2rem] border border-white/10 bg-[#0A0A0A] p-5 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.8)] backdrop-blur">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-500">My requests</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Hackathon request status</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-400">
                {hackathonRequests.length} total
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {hackathonRequests.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-gray-500">
                  No hackathon requests yet. Submit your first one on the left.
                </div>
              ) : (
                hackathonRequests.map((request) => (
                  <article key={request.id} className="rounded-3xl border border-white/10 bg-[#111] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{request.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{request.organization_name}</p>
                      </div>
                      <StatusBadge status={request.approval_status} />
                    </div>

                    {request.tagline ? <p className="mt-3 text-sm leading-6 text-gray-300">{request.tagline}</p> : null}

                    <div className="mt-4 grid gap-3 text-sm text-gray-400 sm:grid-cols-2">
                      <p><span className="text-gray-500">Theme:</span> {request.theme || "Not set"}</p>
                      <p><span className="text-gray-500">Mode:</span> {request.mode || "Online"}</p>
                      <p><span className="text-gray-500">Dates:</span> {formatDate(request.start_date)} - {formatDate(request.end_date)}</p>
                      <p><span className="text-gray-500">Prize pool:</span> {request.prize_pool || "Not set"}</p>
                      <p><span className="text-gray-500">Team size:</span> {request.max_team_size ?? 4}</p>
                      <p><span className="text-gray-500">Submitted:</span> {formatDate(request.created_at)}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
