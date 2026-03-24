"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./login.module.css";

// const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const API_URL = BASE_URL + "/auth/v1/token?grant_type=password";
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        API_URL + "/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // data.access_token → JWT del usuario autenticado
      // data.refresh_token → para renovar la sesión
      // data.user → objeto con info del usuario (id, email, etc.)
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
      console.log(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // error.response?.status → 400 credenciales inválidas, 422 email mal formado
        const msg =
          error.response?.data?.error_description || "Credenciales incorrectas";
        setError(msg);
      } else {
        setError("Error inesperado, intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoBox}>
          <span className={styles.logoUt}>UT</span>
          <span className={styles.logoCancun}>Cancún</span>
          <div className={styles.logoSep} />
          <span className={styles.logoBis}>BiS</span>
          <span className={styles.logoUniv}>UNIVERSITIES</span>
        </div>

        <h1 className={styles.title}>Sistema de Gestión</h1>
        <p className={styles.subtitle}>
          División de Tecnología · Acceso institucional
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Correo institucional</label>
            <input
              className={styles.input}
              type="email"
              placeholder="usuario@utcancun.edu.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Contraseña</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Mensaje de error visible al usuario */}
          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión →"}
          </button>
        </form>

        <p className={styles.hint}>Solo personal autorizado de la división</p>
      </div>
    </div>
  );
}
