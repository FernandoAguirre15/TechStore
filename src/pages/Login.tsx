import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, ApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { AuthResponse, LoginInput } from "../lib/types";
import ErrorNotice from "../components/ErrorNotice";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, sessionMessage, clearSessionMessage } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    return () => clearSessionMessage();
  }, [clearSessionMessage]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: LoginInput = { username, password };
      const res = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: payload,
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Tech<span className="text-accent">Store</span>
          </span>
          <p className="mt-2 text-sm text-off">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-line bg-surface p-6">
          {sessionMessage && (
            <div className="rounded-md border border-warn/30 bg-warn-bg px-4 py-3 text-sm text-warn">
              {sessionMessage}
            </div>
          )}
          <ErrorNotice message={error} />

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Usuario</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="tu.usuario"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-off">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-medium text-accent hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
