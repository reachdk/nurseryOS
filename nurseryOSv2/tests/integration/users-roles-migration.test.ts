import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/20260610061352_users_and_roles.sql"
);

describe("users_and_roles migration", () => {
  const sql = readFileSync(migrationPath, "utf8");

  it("creates roles and users tables", () => {
    expect(sql).toContain("create table public.roles");
    expect(sql).toContain("create table public.users");
  });

  it("seeds six default roles", () => {
    expect(sql).toContain("'Admin'");
    expect(sql).toContain("'Nursery Supervisor'");
    expect(sql).toContain("'Counter Staff'");
    expect(sql).toContain("'Order Taker'");
    expect(sql).toContain("'Planning User'");
    expect(sql).toContain("'Viewer'");
  });

  it("enables RLS", () => {
    expect(sql).toContain("enable row level security");
  });

  it("references auth.users for profile id", () => {
    expect(sql).toContain("references auth.users");
  });
});
