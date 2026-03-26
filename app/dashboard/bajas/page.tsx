"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { bajasGetAll } from "@/lib/api";

interface Baja {
  "No.": number;
  Matricula: number;
  Nombre: string;
  Genero: string;
  ProgramaEducativo: string;
  Grupo: string;
  Turno: string;
  Nivel: string;
  Cuatrimestre: number;
  TipoDeBaja: "Baja Temporal" | "Baja Definitiva";
  Motivo: string;
  Comentarios: string | null;
}

export default function BajasPage() {
  const router = useRouter();
  const [bajas, setBajas] = useState<Baja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBajas = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await bajasGetAll();
        console.log("[bajas] response:", res);
        setBajas(res?.data?.Bajas ?? []);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            `Error ${err.response?.status ?? ""}: ${err.response?.data?.error ?? "No se pudo cargar el historial"}`,
          );
        } else {
          setError("Error inesperado al cargar el historial de bajas");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBajas();
  }, []);

  const tipoBadgeClass = (tipo: string) => {
    if (tipo === "Baja Temporal") return "badge-inactive";
    if (tipo === "Baja Definitiva") return "badge-baja";
    return "";
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Histórico de Bajas</h1>
          <p className="topbar-sub">
            {loading ? "Cargando..." : `${bajas.length} registros`}
          </p>
        </div>
        <div className="topbar-right">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => router.push("/dashboard/alumnos")}
          >
            ← Volver a Alumnos
          </button>
        </div>
      </div>

      <div className="content-area">
        <div className="table-card">
          <div className="table-header">
            <span className="table-title">Registros de bajas</span>
          </div>

          {error && (
            <div style={{ padding: "1rem", color: "red" }}>
              {error} —{" "}
              <button onClick={() => window.location.reload()}>
                Reintentar
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Cargando historial...
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Matrícula</th>
                  <th>Nombre</th>
                  <th>Género</th>
                  <th>Programa Educativo</th>
                  <th>Grupo</th>
                  <th>Turno</th>
                  <th>Nivel</th>
                  <th>Cuatrimestre</th>
                  <th>Tipo de Baja</th>
                  <th>Motivo</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {bajas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      style={{ textAlign: "center", padding: "2rem" }}
                    >
                      No hay registros de bajas
                    </td>
                  </tr>
                ) : (
                  bajas.map((b) => (
                    <tr key={b["No."]}>
                      <td>{b["No."]}</td>
                      <td>
                        <code>{b.Matricula}</code>
                      </td>
                      <td>
                        <strong>{b.Nombre}</strong>
                      </td>
                      <td>{b.Genero}</td>
                      <td>{b.ProgramaEducativo}</td>
                      <td>{b.Grupo}</td>
                      <td>{b.Turno}</td>
                      <td>{b.Nivel}</td>
                      <td style={{ textAlign: "center" }}>{b.Cuatrimestre}</td>
                      <td>
                        <span className={`badge ${tipoBadgeClass(b.TipoDeBaja)}`}>
                          {b.TipoDeBaja}
                        </span>
                      </td>
                      <td>{b.Motivo}</td>
                      <td>{b.Comentarios ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          <div className="pagination">
            <span>Mostrando {bajas.length} registros</span>
          </div>
        </div>
      </div>
    </>
  );
}
