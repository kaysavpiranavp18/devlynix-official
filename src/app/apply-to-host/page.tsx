"use client";

import { useState } from "react";
import { submitOrganizerApplication } from "@/app/actions/organizer";
import { Sparkles, Building2, Globe, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function ApplyToHostPage() {
  const { isSignedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    }
    
    setIsSubmitting(false);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#C6FF00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-[#C6FF00]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-8">You must be signed in and have completed your builder profile to apply for an organizer account.</p>
          <Link href="/sign-in" className="inline-flex items-center justify-center w-full bg-[#C6FF00] text-black font-bold py-3 px-6 rounded-xl hover:shadow-[0_0_20px_rgba(198,255,0,0.3)] transition-all">
            Sign In to Apply
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C6FF00]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-24 pb-24 relative z-10">
        
        <Link href="/hub" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-white mb-12 transition-colors">
          ← Back to Hub
        </Link>

        {success ? (
          <div className="bg-[#0A0A0A] border border-[#C6FF00]/30 rounded-3xl p-12 text-center animate-[slideIn_0.5s_ease-out]">
            <div className="w-20 h-20 bg-[#C6FF00]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#C6FF00]" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4">Application Submitted!</h1>
            <p className="text-gray-400 text-lg max-w-lg mx-auto mb-10">
              Our team will review your application. If approved, your account will be upgraded to an Organizer account, unlocking the hackathon creation dashboard.
            </p>
            <Link href="/hub" className="inline-flex items-center justify-center bg-white/5 border border-white/10 text-white font-bold py-4 px-8 rounded-xl hover:bg-white/10 transition-all">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6FF00]/10 border border-[#C6FF00]/20 text-[#C6FF00] text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" /> Organizer Application
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                Host the next big <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF00] to-green-400">Hackathon.</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Gain access to Devlynix's elite pool of 10x builders. Apply for an organizer account to host, manage, and scale your global hackathons.
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
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
                    placeholder="e.g. Vercel, Supabase, etc."
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
                    rows={4}
                    placeholder="Tell us about the types of hackathons you want to run..."
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
                      <>Submit Application <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-600 mt-4">
                    By submitting, you agree to our Terms of Service. Approvals typically take 24-48 hours.
                  </p>
                </div>

              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
