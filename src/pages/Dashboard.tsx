import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiRequest, ApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { ProductPage } from "../lib/types";
import AppShell from "../components/AppShell";
import ProductCard from "../components/ProductCard";
import ErrorNotice from "../components/ErrorNotice";

const PAGE_SIZE = 9;

export default function Dashboard() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<ProductPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const load = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest<ProductPage>(`/products?page=${pageNumber}&size=${PAGE_SIZE}`);
        setData(res);
      } catch (err) {
        if (err instanceof ApiError && err.kind === "UNAUTHORIZED") {
          logout("Tu sesión expiró. Vuelve a iniciar sesión.");
          return;
        }
        if (err instanceof ApiError) setError(err.message);
        else setError("Ocurrió un error inesperado.");
      } finally {
        setLoading(false);
      }
    },
    [logout]
  );

  useEffect(() => {
    load(page);
  }, [page, load]);

  const products = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Catálogo</h1>
          <p className="text-sm text-off">
            {data ? `${data.totalElements} productos` : "Cargando catálogo..."}
          </p>
        </div>
        <Link
          to="/products/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
        >
          Nuevo producto
        </Link>
      </div>

      <ErrorNotice message={error} />

      {loading && (
        <div className="py-16 text-center text-sm text-off">Cargando productos...</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-lg border border-dashed border-line py-16 text-center">
          <p className="text-sm font-medium text-ink">Todavía no hay productos</p>
          <p className="mt-1 text-sm text-off">Crea el primero para empezar tu catálogo.</p>
          <Link
            to="/products/new"
            className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            Agregar producto
          </Link>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-sm text-off">
              Página {page + 1} de {Math.max(totalPages, 1)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= totalPages}
              className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </AppShell>
  );
}
