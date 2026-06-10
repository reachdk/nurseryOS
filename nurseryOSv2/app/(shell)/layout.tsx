import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/common/ToastProvider";
import { getAppUser } from "@/server/auth/session";

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
  const user = await getAppUser();

  return (
    <ToastProvider>
      <AppShell user={user}>{children}</AppShell>
    </ToastProvider>
  );
}
