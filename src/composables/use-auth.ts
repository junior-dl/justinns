"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useFavoriteStore } from "@/stores/favorite.store";

export function useAuth() {
  const { data, isPending, refetch } = authClient.useSession();
  const router = useRouter();
  const clearFavorites = useFavoriteStore((s) => s.clear);

  return {
    user: data?.user ?? null,
    isAdmin: data?.user?.role === "admin",
    isPending,
    async signIn(email: string, password: string) {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) throw new Error(error.message ?? "Wrong email or password.");
      await refetch();
    },
    async signUp(input: { name: string; email: string; password: string; phone?: string }) {
      const { error } = await authClient.signUp.email(input);
      if (error) throw new Error(error.message ?? "Could not create your account.");
      await refetch();
    },
    async signOut() {
      await authClient.signOut();
      clearFavorites();
      router.push("/");
      router.refresh();
    },
  };
}
