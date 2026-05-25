"use client";

export function HackathonStatusSelect({
  currentStatus,
}: {
  currentStatus: string;
}) {
  return (
    <select
      name="status"
      defaultValue={currentStatus}
      className="bg-[#111] border border-white/5 text-xs rounded-md px-2 py-2 text-gray-300 focus:outline-none focus:border-emerald-500"
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
    >
      <option value="PENDING">PENDING</option>
      <option value="APPROVED">APPROVED</option>
      <option value="REJECTED">REJECTED</option>
    </select>
  );
}