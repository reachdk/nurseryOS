"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/server/db/client.server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard").trim() || "/dashboard";

  if (!email || !password) {
    redirect("/login?error=" + encodeURIComponent("Email and password are required."));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  const authUser = data.user;
  if (!authUser) {
    redirect("/login?error=" + encodeURIComponent("Sign-in failed. Please try again."));
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("status")
    .eq("id", authUser.id)
    .maybeSingle();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    redirect(
      "/login?error=" +
        encodeURIComponent("No staff profile is linked to this account. Contact an admin.")
    );
  }

  if (profile.status !== "active") {
    await supabase.auth.signOut();
    redirect(
      "/login?error=" + encodeURIComponent("This account is inactive. Contact an admin.")
    );
  }

  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
