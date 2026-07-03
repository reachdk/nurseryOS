import { signOut } from "@/app/login/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm font-medium text-stone-500 hover:text-stone-800"
      >
        Sign out
      </button>
    </form>
  );
}
