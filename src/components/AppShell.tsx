import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/dashboard" className="font-display text-lg font-semibold tracking-tight text-ink">
            Tech<span className="text-accent">Store</span>
          </Link>
          <button
            onClick={() => logout()}
            className="text-sm font-medium text-off transition hover:text-ink"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
