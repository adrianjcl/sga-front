"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { grupoGetDetails, calificacionesStatsByGrupo } from "@/lib/api";

interface Grupo {
  id: number;
  nom: string;
  salon: string;
  tutor_nomina: number | null;
  tutor_nombres: string | null;
  tutor_apellidos: string | null;
  num_alumnos: number;
}

interface GrupoStats {
  promedio: number;
  acreditados: number;
  reprobados: number;
  total: number;
}

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [openGrupoId, setOpenGrupoId] = useState<number | null>(null);
  const [selectedStats, setSelectedStats] = useState<GrupoStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await grupoGetDetails();
      console.log("[grupos] response:", data);
      const list: Grupo[] = data?.data?.Grupos ?? [];
      setGrupos(list);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error ${err.response?.status ?? ""}: ${err.response?.data?.error ?? "No se pudo cargar la lista"}`);
      } else {
        setError("Error inesperado al cargar grupos");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewStats = async (id: number) => {
    if (openGrupoId === id) {
      setOpenGrupoId(null);
      setSelectedStats(null);
      return;
    }
    setOpenGrupoId(id);
    setStatsLoading(true);
    setSelectedStats(null);
    try {
      const data = await calificacionesStatsByGrupo(id);
      console.log("[grupos] stats response:", data);
      setSelectedStats({
        promedio: data?.data?.promedio,
        acreditados: data?.data?.acreditados,
        reprobados: data?.data?.reprobados,
        total: data?.data?.total,
      });
    } catch (err) {
      console.error("[grupos] stats error", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const filtered = grupos.filter(
    (g) =>
      g.nom.toLowerCase().includes(search.toLowerCase()) ||
      (g.salon ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Grupos</h1>
          <p className="topbar-sub">
            {loading ? "Cargando..." : `${grupos.length} grupos activos`}
          </p>
        </div>
        <div className="topbar-right">
          <button className="btn btn-primary btn-sm">+ Nuevo grupo</button>
        </div>
      </div>

      <div className="content-area">
        <div className="table-card">
          <div className="table-header">
            <span className="table-title">Todos los grupos</span>
            <input
              className="search-input"
              placeholder="🔍 Buscar grupo o salón..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ padding: "1rem", color: "red" }}>
              {error} — <button onClick={fetchGrupos}>Reintentar</button>
            </div>
          )}

          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Cargando grupos...
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th>Salón</th>
                  <th>Tutor</th>
                  <th>Alumnos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                      No se encontraron grupos
                    </td>
                  </tr>
                ) : (
                  filtered.map((g) => (
                    <>
                      <tr key={g.id}>
                        <td>
                          <strong>{g.nom}</strong>
                        </td>
                        <td>{g.salon}</td>
                        <td>
                          {g.tutor_nombres
                            ? `${g.tutor_nombres} ${g.tutor_apellidos}`
                            : <span style={{ color: "var(--gray-400)" }}>Sin asignar</span>}
                        </td>
                        <td>{g.num_alumnos}</td>
                        <td>
                          <button
                            className="action-btn"
                            title="Ver estadísticas"
                            onClick={() => handleViewStats(g.id)}
                          >
                            👁️
                          </button>
                        </td>
                      </tr>
                      {openGrupoId === g.id && (
                        <tr key={`stats-${g.id}`}>
                          <td
                            colSpan={5}
                            style={{ background: "var(--gray-50)", padding: "1rem 1.5rem" }}
                          >
                            {statsLoading ? (
                              <p style={{ fontSize: 13 }}>Cargando estadísticas...</p>
                            ) : selectedStats ? (
                              <div
                                style={{
                                  display: "flex",
                                  gap: 32,
                                  fontSize: 13,
                                }}
                              >
                                <div>
                                  <p style={{ color: "var(--gray-500)", marginBottom: 2 }}>
                                    Promedio
                                  </p>
                                  <p style={{ fontWeight: 700, fontSize: 20 }}>
                                    {selectedStats.promedio?.toFixed(1) ?? "—"}
                                  </p>
                                </div>
                                <div>
                                  <p style={{ color: "var(--gray-500)", marginBottom: 2 }}>
                                    Acreditados
                                  </p>
                                  <p style={{ fontWeight: 700, fontSize: 20, color: "var(--green)" }}>
                                    {selectedStats.acreditados}
                                  </p>
                                </div>
                                <div>
                                  <p style={{ color: "var(--gray-500)", marginBottom: 2 }}>
                                    Reprobados
                                  </p>
                                  <p style={{ fontWeight: 700, fontSize: 20, color: "#C0392B" }}>
                                    {selectedStats.reprobados}
                                  </p>
                                </div>
                                <div>
                                  <p style={{ color: "var(--gray-500)", marginBottom: 2 }}>
                                    Total registros
                                  </p>
                                  <p style={{ fontWeight: 700, fontSize: 20 }}>
                                    {selectedStats.total}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p style={{ fontSize: 13, color: "var(--gray-500)" }}>
                                Sin estadísticas disponibles
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          )}

          <div className="pagination">
            <span>
              Mostrando {filtered.length} de {grupos.length} grupos
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
