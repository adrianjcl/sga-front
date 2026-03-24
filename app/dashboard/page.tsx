"use client";
import { useState, useEffect } from "react";
import {
  grupoGetAll,
  alumnoGet,
  alumnoGetWarns,
  docenteGet,
  carreraGetAll,
} from "@/lib/api";
import axios from "axios";

interface Carrera {
  id: number;
  nom: string;
  nombre: string;
}

interface Alumno {
  matricula: number;
  nombres: string;
  apellidos: string;
  carrera: number;
  estado: string;
  promedio_actual: number;
}

export default function DashboardPage() {
  const [gruposCount, setGruposCount] = useState<number | null>(null);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [warnsCount, setWarnsCount] = useState<number | null>(null);
  const [docentesCount, setDocentesCount] = useState<number | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [gruposRes, alumnosRes, warnsRes, docentesRes, carrerasRes] =
        await Promise.allSettled([
          grupoGetAll(),
          alumnoGet(),
          alumnoGetWarns(),
          docenteGet(),
          carreraGetAll(),
        ]);

      if (gruposRes.status === "fulfilled") {
        const list = gruposRes.value?.data?.Grupos ?? [];
        setGruposCount(list.length);
      }
      if (alumnosRes.status === "fulfilled") {
        const list: Alumno[] = alumnosRes.value?.data?.Alumnos ?? [];
        setAlumnos(list);
      }
      if (warnsRes.status === "fulfilled") {
        const list = warnsRes.value?.data?.Alumnos ?? [];
        setWarnsCount(list.length);
      }
      if (docentesRes.status === "fulfilled") {
        const list = docentesRes.value?.data?.Docentes ?? [];
        setDocentesCount(list.length);
      }
      if (carrerasRes.status === "fulfilled") {
        setCarreras(carrerasRes.value?.data?.Carreras ?? []);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("[dashboard] fetch error:", err.response?.status);
      }
    } finally {
      setLoading(false);
    }
  };

  // Count alumnos per carrera for bar chart
  const alumnosByCarrera = carreras.map((c) => ({
    ...c,
    count: alumnos.filter((a) => a.carrera === c.id).length,
  }));
  const maxCount = Math.max(...alumnosByCarrera.map((c) => c.count), 1);

  // Count alumnos by estado for donut
  const activos = alumnos.filter((a) => a.estado === "Activo").length;
  const bajaTemp = alumnos.filter((a) => a.estado === "Baja Temporal").length;
  const bajaDef = alumnos.filter((a) => a.estado === "Baja Definitiva").length;
  const totalAlumnos = alumnos.length;

  const stats = [
    {
      label: "Grupos activos",
      value: loading ? "…" : (gruposCount ?? "—"),
      change: "Total de grupos",
      accent: "teal",
    },
    {
      label: "Alumnos",
      value: loading ? "…" : totalAlumnos || "—",
      change: `${activos} activos`,
      accent: "teal",
    },
    {
      label: "Docentes",
      value: loading ? "…" : (docentesCount ?? "—"),
      change: "Personal docente",
      accent: "green",
    },
    {
      label: "Alumnos en riesgo",
      value: loading ? "…" : (warnsCount ?? "—"),
      change: "Promedio actual < 7",
      accent: "red",
    },
  ];

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Dashboard</h1>
          <p className="topbar-sub">Ciclo 2025-A · Cuatrimestre Enero–Abril</p>
        </div>
      </div>

      <div className="content-area">
        {/* Stat cards */}
        <div className="stats-grid">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`stat-card ${s.accent === "green" ? "green-accent" : s.accent === "red" ? "red-accent" : ""}`}
            >
              <p className="stat-label">{s.label}</p>
              <p className={`stat-val ${s.accent === "red" ? "red" : ""}`}>
                {s.value}
              </p>
              <p className={`stat-change ${s.accent === "red" ? "red" : ""}`}>
                {s.change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {/* Bar chart — alumnos por carrera */}
          <div
            style={{
              background: "var(--white)",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-lg)",
              padding: 20,
            }}
          >
            <p
              style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}
            >
              Alumnos por carrera
            </p>
            {loading ? (
              <p style={{ fontSize: 12, color: "var(--gray-500)" }}>
                Cargando...
              </p>
            ) : alumnosByCarrera.length === 0 ? (
              <p style={{ fontSize: 12, color: "var(--gray-500)" }}>
                Sin datos
              </p>
            ) : (
              alumnosByCarrera.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      width: 130,
                      fontSize: 11,
                      color: "var(--gray-600)",
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {c.nom}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      background: "var(--gray-100)",
                      borderRadius: 4,
                      height: 14,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 4,
                        width: `${Math.round((c.count / maxCount) * 100)}%`,
                        background: "var(--teal)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      width: 28,
                      fontSize: 11,
                      color: "var(--gray-600)",
                    }}
                  >
                    {c.count}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Donut — estatus de alumnos */}
          <div
            style={{
              background: "var(--white)",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-lg)",
              padding: 20,
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
              Estatus de alumnos
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                justifyContent: "center",
              }}
            >
              <svg width="110" height="110" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#EEF0F2"
                  strokeWidth="16"
                />
                {totalAlumnos > 0 && (
                  <>
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#00A896"
                      strokeWidth="16"
                      strokeDasharray={`${(activos / totalAlumnos) * 238} 238`}
                      strokeDashoffset="60"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#E8A020"
                      strokeWidth="16"
                      strokeDasharray={`${(bajaTemp / totalAlumnos) * 238} 238`}
                      strokeDashoffset={`${-(activos / totalAlumnos) * 238 + 60}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#C0392B"
                      strokeWidth="16"
                      strokeDasharray={`${(bajaDef / totalAlumnos) * 238} 238`}
                      strokeDashoffset={`${-((activos + bajaTemp) / totalAlumnos) * 238 + 60}`}
                    />
                  </>
                )}
                <text
                  x="50"
                  y="54"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill="#007A6E"
                >
                  {loading ? "…" : totalAlumnos}
                </text>
              </svg>
              <div>
                {[
                  { color: "#00A896", label: "Activos", count: activos },
                  {
                    color: "#E8A020",
                    label: "Baja Temporal",
                    count: bajaTemp,
                  },
                  {
                    color: "#C0392B",
                    label: "Baja Definitiva",
                    count: bajaDef,
                  },
                ].map((l) => (
                  <div
                    key={l.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 8,
                      fontSize: 12,
                      color: "var(--gray-600)",
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: l.color,
                        flexShrink: 0,
                      }}
                    />
                    {l.label} ({loading ? "…" : l.count})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
