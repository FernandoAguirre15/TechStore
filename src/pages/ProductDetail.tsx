import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiRequest, ApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { Product, ProductInput } from "../lib/types";
import AppShell from "../components/AppShell";
import ErrorNotice from "../components/ErrorNotice";

const CATEGORIES = ["Laptops", "Celulares", "Componentes", "Periféricos", "Audio", "Monitores", "Accesorios"];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState<ProductInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await apiRequest<Product>(`/products/${id}`);
        const { id: _omit, ...rest } = res;
        void _omit;
        setForm(rest);
      } catch (err) {
        if (err instanceof ApiError && err.kind === "UNAUTHORIZED") {
          logout("Tu sesión expiró. Vuelve a iniciar sesión.");
          return;
        }
        if (err instanceof ApiError) setLoadError(err.message);
        else setLoadError("Ocurrió un error inesperado.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, logout]);

  function update<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaveError(null);
    setSaving(true);
    try {
      await apiRequest<Product>(`/products/${id}`, { method: "PUT", body: form });
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.kind === "UNAUTHORIZED") {
        logout("Tu sesión expiró. Vuelve a iniciar sesión.");
        return;
      }
      if (err instanceof ApiError) setSaveError(err.message);
      else setSaveError("Ocurrió un error inesperado.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaveError(null);
    setDeleting(true);
    try {
      await apiRequest<void>(`/products/${id}`, { method: "DELETE" });
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.kind === "UNAUTHORIZED") {
        logout("Tu sesión expiró. Vuelve a iniciar sesión.");
        return;
      }
      if (err instanceof ApiError) setSaveError(err.message);
      else setSaveError("Ocurrió un error inesperado.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center gap-3">
        <Link to="/dashboard" className="text-sm text-off hover:text-ink">
          Catálogo
        </Link>
        <span className="text-off">/</span>
        <span className="text-sm font-medium text-ink">Editar producto</span>
      </div>

      {loading && <p className="text-sm text-off">Cargando producto...</p>}

      {!loading && loadError && (
        <div className="max-w-lg">
          <ErrorNotice message={loadError} />
          <Link to="/dashboard" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Volver al catálogo
          </Link>
        </div>
      )}

      {!loading && !loadError && form && (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-xl border border-line bg-surface p-6">
          <ErrorNotice message={saveError} />

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Nombre</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Descripción</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Disponibilidad</label>
              <select
                value={form.availability}
                onChange={(e) => update("availability", e.target.value as ProductInput["availability"])}
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              >
                <option value="DISPONIBLE">Disponible</option>
                <option value="AGOTADO">Agotado</option>
                <option value="PROXIMAMENTE">Próximamente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Precio (S/)</label>
              <input
                type="number"
                required
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => update("price", Number(e.target.value))}
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Stock</label>
              <input
                type="number"
                required
                min={0}
                step="1"
                value={form.stock}
                onChange={(e) => update("stock", Number(e.target.value))}
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">URL de imagen</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              <Link
                to="/dashboard"
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
              >
                Cancelar
              </Link>
            </div>

            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-sm font-medium text-danger hover:underline"
              >
                Eliminar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-off">¿Seguro?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-md bg-danger px-3 py-1.5 text-sm font-medium text-white transition hover:bg-danger/90 disabled:opacity-60"
                >
                  {deleting ? "Eliminando..." : "Sí, eliminar"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-sm text-off hover:text-ink"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </form>
      )}
    </AppShell>
  );
}
