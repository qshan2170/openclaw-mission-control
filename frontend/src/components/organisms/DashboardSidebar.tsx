"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bot,
  Boxes,
  CheckCircle2,
  Folder,
  Building2,
  LayoutGrid,
  Network,
  Settings,
  Store,
  Tags,
} from "lucide-react";

import { useAuth } from "@/auth/clerk";
import { ApiError } from "@/api/mutator";
import { useOrganizationMembership } from "@/lib/use-organization-membership";
import {
  type healthzHealthzGetResponse,
  useHealthzHealthzGet,
} from "@/api/generated/default/default";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { isAdmin } = useOrganizationMembership(isSignedIn);
  const healthQuery = useHealthzHealthzGet<healthzHealthzGetResponse, ApiError>(
    {
      query: {
        refetchInterval: 30_000,
        refetchOnMount: "always",
        retry: false,
      },
      request: { cache: "no-store" },
    },
  );

  const okValue = healthQuery.data?.data?.ok;
  const systemStatus: "unknown" | "operational" | "degraded" =
    okValue === true
      ? "operational"
      : okValue === false
        ? "degraded"
        : healthQuery.isError
          ? "degraded"
          : "unknown";
  const statusLabel =
    systemStatus === "operational"
      ? "All systems operational"
      : systemStatus === "unknown"
        ? "System status unavailable"
        : "System degraded";

  const navItemClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-700 transition dark:text-slate-300",
      active
        ? "bg-blue-100 text-blue-800 font-medium dark:bg-blue-950/60 dark:text-blue-200"
        : "hover:bg-slate-100 dark:hover:bg-slate-800",
    );

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[280px] -translate-x-full flex-col border-r border-slate-200 bg-white pt-16 shadow-lg transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-950 [[data-sidebar=open]_&]:translate-x-0 md:relative md:inset-auto md:z-auto md:w-[260px] md:translate-x-0 md:pt-0 md:shadow-none md:transition-none">
      <div className="flex-1 px-3 py-4">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Navigation
        </p>
        <nav className="mt-3 space-y-4 text-sm">
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overview
            </p>
            <div className="mt-1 space-y-1">
              <Link href="/dashboard" className={navItemClass(pathname === "/dashboard")}>
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/activity" className={navItemClass(pathname.startsWith("/activity"))}>
                <Activity className="h-4 w-4" />
                Live feed
              </Link>
            </div>
          </div>

          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Boards
            </p>
            <div className="mt-1 space-y-1">
              <Link href="/board-groups" className={navItemClass(pathname.startsWith("/board-groups"))}>
                <Folder className="h-4 w-4" />
                Board groups
              </Link>
              <Link href="/boards" className={navItemClass(pathname.startsWith("/boards"))}>
                <LayoutGrid className="h-4 w-4" />
                Boards
              </Link>
              <Link href="/tags" className={navItemClass(pathname.startsWith("/tags"))}>
                <Tags className="h-4 w-4" />
                Tags
              </Link>
              <Link href="/approvals" className={navItemClass(pathname.startsWith("/approvals"))}>
                <CheckCircle2 className="h-4 w-4" />
                Approvals
              </Link>
              {isAdmin ? (
                <Link href="/custom-fields" className={navItemClass(pathname.startsWith("/custom-fields"))}>
                  <Settings className="h-4 w-4" />
                  Custom fields
                </Link>
              ) : null}
            </div>
          </div>

          <div>
            {isAdmin ? (
              <>
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Skills
                </p>
                <div className="mt-1 space-y-1">
                  <Link
                    href="/skills/marketplace"
                    className={navItemClass(
                      pathname === "/skills" || pathname.startsWith("/skills/marketplace"),
                    )}
                  >
                    <Store className="h-4 w-4" />
                    Marketplace
                  </Link>
                  <Link href="/skills/packs" className={navItemClass(pathname.startsWith("/skills/packs"))}>
                    <Boxes className="h-4 w-4" />
                    Packs
                  </Link>
                </div>
              </>
            ) : null}
          </div>

          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Administration
            </p>
            <div className="mt-1 space-y-1">
              <Link href="/organization" className={navItemClass(pathname.startsWith("/organization"))}>
                <Building2 className="h-4 w-4" />
                Organization
              </Link>
              {isAdmin ? (
                <Link href="/gateways" className={navItemClass(pathname.startsWith("/gateways"))}>
                  <Network className="h-4 w-4" />
                  Gateways
                </Link>
              ) : null}
              {isAdmin ? (
                <Link href="/agents" className={navItemClass(pathname.startsWith("/agents"))}>
                  <Bot className="h-4 w-4" />
                  Agents
                </Link>
              ) : null}
            </div>
          </div>
        </nav>
      </div>
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              systemStatus === "operational" && "bg-emerald-500",
              systemStatus === "degraded" && "bg-rose-500",
              systemStatus === "unknown" && "bg-slate-300 dark:bg-slate-600",
            )}
          />
          {statusLabel}
        </div>
      </div>
    </aside>
  );
}
