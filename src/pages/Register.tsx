import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, ApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { AuthResponse, RegisterInput } from "../lib/types";
import ErrorNotice from "../components/ErrorNotice";

export default function Register() {
  const [form, setForm] = useState<RegisterInput>({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function update<K extends keyof RegisterInput>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: form,
        auth: false,
      });
      login(res.token);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Tech<span className="text-accent">Store</span>
          </span>
          <p className="mt-2 text-sm text-off">Crea tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-line bg-surface p-6">
          <ErrorNotice message={error} />

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Nombre completo</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Cesar Torres"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Usuario</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="tu.usuario"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Correo</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Contraseña</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-off">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
