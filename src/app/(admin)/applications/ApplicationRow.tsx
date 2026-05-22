"use client";

import { useState } from "react";
import { approveOrganizer, rejectOrganizer } from "@/app/actions/admin";
import { Globe, User as UserIcon, CalendarDays, CheckCircle, XCircle } from "lucide-react";

export default function ApplicationRow({ application }: { application: any }) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    const res = await approveOrganizer(application.id, application.user_id, application.user.clerk_user_id);
    if (res?.error) {
      alert(res.error);
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this application?")) return;
    setIsRejecting(true);
    const res = await rejectOrganizer(application.id);
    if (res?.error) {
      alert(res.error);
      setIsRejecting(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#C6FF00]/30 transition-colors">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        
        {/* Left: Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{application.company_name}</h3>
            {application.website && (
              <a href={application.website} target="_blank" rel="noreferrer" className="text-[#C6FF00] hover:underline text-sm flex items-center gap-1 font-mono">
                <Globe className="w-3 h-3" /> {application.website}
              </a>
            )}
          </div>
          
          <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-sm text-gray-300">
            {application.description}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" /> @{application.user?.username || 'Unknown'}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> {new Date(application.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex md:flex-col gap-3 justify-center shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6">
          <button 
            onClick={handleApprove}
            disabled={isApproving || isRejecting}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#C6FF00]/10 hover:bg-[#C6FF00] text-[#C6FF00] hover:text-black border border-[#C6FF00]/30 font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
          >
            {isApproving ? "Approving..." : <><CheckCircle className="w-4 h-4" /> Approve</>}
          </button>
          <button 
            onClick={handleReject}
            disabled={isApproving || isRejecting}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
          >
            {isRejecting ? "Rejecting..." : <><XCircle className="w-4 h-4" /> Reject</>}
          </button>
        </div>

      </div>
    </div>
  );
}
