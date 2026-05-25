"use client";

import { useEffect, useState } from "react";
import { submitOrganizerApplication } from "@/app/actions/organizer";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  Sparkles,
  Clock3,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

type OrganizerApplication = {
  id: string;
  company_name: string;
  website: string | null;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
};

export default function ApplyToHostPage() {
  const { isSignedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<OrganizerApplication[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);

  const loadApplications = async () => {
    setIsLoadingApplications(true);
    setApplicationsError(null);

    try {
      const response = await fetch("/api/me/organizer-applications", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load applications.");
      }

      const data = await response.json();
      setApplications(data.applications ?? []);
    } catch {
      setApplicationsError("Could not load your applications right now.");
    } finally {
      setIsLoadingApplications(false);
    }
  };

  useEffect(() => {
    if (!isSignedIn) return;
    loadApplications();
  }, [isSignedIn]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const res = await submitOrganizerApplication(formData);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(true);
      await loadApplications();
    }

    setIsSubmitting(false);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
        <div className="relative max-w-md w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-8 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(198,255,0,0.12),transparent_45%)]" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-[#C6FF00]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C6FF00]/20">
              <Building2 className="w-8 h-8 text-[#C6FF00]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-400 mb-8">
              You must be signed in and have a builder profile to apply for organizer access and host hackathons.
            </p>
            <Link href="/sign-in" className="inline-flex items-center justify-center w-full bg-[#C6FF00] text-black font-bold py-3 px-6 rounded-xl hover:shadow-[0_0_20px_rgba(198,255,0,0.3)] transition-all">
              Sign In to Apply
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C6FF00]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-4 pb-16 relative z-10">

        {success ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6">
            <div className="bg-[#0A0A0A] border border-[#C6FF00]/30 rounded-3xl p-10">
              <div className="w-18 h-18 bg-[#C6FF00]/20 rounded-full flex items-center justify-center mb-6 border border-[#C6FF00]/20">
                <CheckCircle2 className="w-9 h-9 text-[#C6FF00]" />
              </div>
              <h1 className="text-3xl font-black text-white mb-4">Application Submitted</h1>
              <p className="text-gray-400 text-base max-w-lg leading-7">
                Your host request is now in the review queue. Once approved, you will unlock the organizer workspace and be able to submit hackathon requests.
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">My Applications</h2>
                  <p className="text-sm text-gray-500 mt-1">Your previous organizer requests</p>
                </div>
                <Clock3 className="w-5 h-5 text-[#C6FF00]" />
              </div>
              <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
                {isLoadingApplications ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-400">Loading your applications...</div>
                ) : applicationsError ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{applicationsError}</div>
                ) : applications.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-400">You have not submitted any applications yet.</div>
                ) : (
                  applications.map((application) => (
                    <div key={application.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-white">{application.company_name}</h3>
                          <p className="text-xs text-gray-500 mt-1">{new Date(application.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider ${
                          application.status === "APPROVED"
                            ? "bg-emerald-900/20 text-emerald-500"
                            : application.status === "PENDING"
                              ? "bg-amber-900/20 text-amber-500"
                              : "bg-red-900/20 text-red-500"
                        }`}>
                          {application.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-400 leading-6 line-clamp-3">{application.description}</p>
                      {application.website && (
                        <a href={application.website} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs text-[#C6FF00] hover:underline">
                          {application.website}
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6">
              <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-5 h-5 text-[#C6FF00]" />
                  <h2 className="text-2xl font-bold text-white">Host a Hackathon</h2>
                </div>

                <p className="text-gray-400 mb-8 max-w-2xl leading-7">
                  Submit your host application. Your previous applications will appear in My Applications on the right.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Building2 className="w-4 h-4 text-gray-500" /> Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="e.g. Devlynix Community"
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00]/50 focus:bg-[#151515] transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Globe className="w-4 h-4 text-gray-500" /> Website URL
                    </label>
                    <input
                      type="url"
                      name="website"
                      placeholder="https://yourcompany.com"
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00]/50 focus:bg-[#151515] transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <FileText className="w-4 h-4 text-gray-500" /> Why do you want to host on Devlynix? *
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={5}
                      placeholder="Tell us about your community and the hackathons you want to run..."
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00]/50 focus:bg-[#151515] transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#C6FF00] text-black font-bold py-4 px-8 rounded-xl hover:shadow-[0_0_20px_rgba(198,255,0,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>Submit Host Application <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-600 mt-4">Approvals typically take 24-48 hours.</p>
                  </div>
                </form>
              </div>

              <div className="space-y-6">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">My Applications</h3>
                      <p className="text-sm text-gray-500 mt-1">All of your organizer requests</p>
                    </div>
                    <button type="button" onClick={loadApplications} className="text-xs text-[#C6FF00] hover:underline">
                      Refresh
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[36rem] overflow-y-auto pr-1">
                    {isLoadingApplications ? (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-400">Loading your applications...</div>
                    ) : applicationsError ? (
                      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{applicationsError}</div>
                    ) : applications.length === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-400">You have not submitted any applications yet.</div>
                    ) : (
                      applications.map((application) => (
                        <div key={application.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-semibold text-white">{application.company_name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{new Date(application.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider ${
                              application.status === "APPROVED"
                                ? "bg-emerald-900/20 text-emerald-500"
                                : application.status === "PENDING"
                                  ? "bg-amber-900/20 text-amber-500"
                                  : "bg-red-900/20 text-red-500"
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-gray-400 leading-6">{application.description}</p>
                          {application.website && (
                            <a href={application.website} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs text-[#C6FF00] hover:underline">
                              {application.website}
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
