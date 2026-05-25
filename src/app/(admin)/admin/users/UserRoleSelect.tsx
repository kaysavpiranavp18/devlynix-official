"use client";

export function UserRoleSelect({ currentRole }: { currentRole: string }) {
  return (
    <select
      name="role"
      defaultValue={currentRole}
      className="bg-[#111] border border-white/5 text-xs rounded-md px-2 py-1 text-gray-300 focus:outline-none focus:border-emerald-500"
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
    >
      <option value="HACKER">HACKER</option>
      <option value="ORGANIZER">ORGANIZER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}