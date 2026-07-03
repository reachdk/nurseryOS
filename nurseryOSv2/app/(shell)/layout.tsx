import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/common/ToastProvider";
import { getAppUser, getAuthUser } from "@/server/auth/session";

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
  const authUser = await getAuthUser();
  if (!authUser) {
    redirect("/login");
  }

  const user = await getAppUser();
  if (!user) {
    redirect(
      "/login?error=" +
        encodeURIComponent("Staff profile not found or account is inactive. Contact an admin.")
    );
  }

  return (
    <ToastProvider>
      <AppShell user={user}>{children}</AppShell>
    </ToastProvider>
  );
}
