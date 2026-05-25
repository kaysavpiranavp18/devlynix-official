import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Users, ShieldAlert, Zap, Search } from "lucide-react";
import { revalidatePath } from "next/cache";
import { UserRoleSelect } from "./UserRoleSelect";

// Inline Server Action to change role
async function changeUserRole(formData: FormData) {
  "use server";
  const { userId: adminId } = await auth();
  if (!adminId) throw new Error("Unauthorized");
  
  const admin = await prisma.user.findUnique({ where: { clerk_user_id: adminId } });
  if (admin?.role !== "ADMIN") throw new Error("Forbidden");

  const userId = formData.get("userId") as string;
  const newRole = formData.get("role") as "HACKER" | "ORGANIZER" | "ADMIN";

  const targetUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!targetUser) throw new Error("User not found");

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  const client = await clerkClient();
  await client.users.updateUserMetadata(targetUser.clerk_user_id, {
    publicMetadata: { role: newRole }
  });

  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const currentUser = await prisma.user.findUnique({ where: { clerk_user_id: userId } });
  if (currentUser?.role !== "ADMIN") redirect("/hub");

  const users = await prisma.user.findMany({
    orderBy: { created_at: "desc" },
    take: 100 // Limit for now, can add pagination later
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 border-b border-[#111] pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all builders, assign roles, and monitor progress.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search builders..." 
            className="bg-[#0A0A0A] border border-[#111] text-white text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-emerald-900/50"
          />
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-[#111] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#050505] text-xs uppercase font-mono text-gray-600 border-b border-[#111]">
              <tr>
                <th className="px-6 py-4">Builder</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">XP & Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#111]/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-xs text-gray-500 font-mono">
                        {user.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-white">@{user.username || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">{user.email || 'No email provided'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider ${
                      user.role === 'ADMIN' ? 'bg-red-900/20 text-red-500' :
                      user.role === 'ORGANIZER' ? 'bg-blue-900/20 text-blue-500' :
                      'bg-[#111] text-gray-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-emerald-500 font-mono font-bold">{user.xp.toLocaleString()} XP</div>
                    <div className="text-xs text-gray-500">{user.builder_level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <form action={changeUserRole} className="inline-block">
                      <input type="hidden" name="userId" value={user.id} />
                      <UserRoleSelect currentRole={user.role} />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
