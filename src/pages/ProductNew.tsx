import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest, ApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { Product, ProductInput } from "../lib/types";
import AppShell from "../components/AppShell";
import ErrorNotice from "../components/ErrorNotice";

const CATEGORIES = ["Laptops", "Celulares", "Componentes", "Periféricos", "Audio", "Monitores", "Accesorios"];

const EMPTY: ProductInput = {
  name: "",
  description: "",
  category: CATEGORIES[0],
  price: 0,
  stock: 0,
  imageUrl: "",
  availability: "DISPONIBLE",
};

export default function ProductNew() {
  const [form, setForm] = useState<ProductInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  function update<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiRequest<Product>("/products", { method: "POST", body: form });
      navigate("/dashboard");
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
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center gap-3">
        <Link to="/dashboard" className="text-sm text-off hover:text-ink">
          Catálogo
        </Link>
        <span className="text-off">/</span>
        <span className="text-sm font-medium text-ink">Nuevo producto</span>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-xl border border-line bg-surface p-6">
        <ErrorNotice message={error} />

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Nombre</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="Laptop Lenovo ThinkPad X1"
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
            placeholder="Detalles del producto"
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
            placeholder="https://..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-60"
          >
            {loading ? "Creando..." : "Crear producto"}
          </button>
          <Link
            to="/dashboard"
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
