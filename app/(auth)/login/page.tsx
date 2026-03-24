"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { authLogin } from "@/lib/api";
import styles from "./login.module.css";

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
      const data = await authLogin(email, password);
      console.log("[login] response:", data);
      const token = data?.data?.session?.access_token;
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
