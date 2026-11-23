"use client";
import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/composables/use-auth";
import { Skeleton, Alert } from "./ui";

export function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, isAdmin, isPending } = useAuth();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (!isPending && !user) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [isPending, user, router, path]);

  if (isPending || !user) return <div className="space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-64" /></div>;
  if (admin && !isAdmin) return <Alert>This page is for JustInns admins.</Alert>;
  return <>{children}</>;
}
