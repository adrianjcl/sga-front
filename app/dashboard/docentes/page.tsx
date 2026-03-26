"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  docenteGet,
  docenteGetByNomina,
  docenteCreate,
  horarioGetByDocente,
  calificacionesStatsByDocente,
  type DocenteCreateBody,
} from "@/lib/api";

interface Docente {
  nomina: number;
  nombres: string;
  apellidos: string;
  correo: string;
  cargo: string;
}

interface HorarioEntry {
  materia: { nombre: string };
  inicio: string;
  fin: string;
  dia: string;
}

interface DocenteStats {
  promedio: number;
  acreditados: number;
  reprobados: number;
  total: number;
}

interface DocenteDetail {
  docente: Docente & { auth_id?: string };
  horario: HorarioEntry[];
  stats: DocenteStats | null;
}

const CARGO_OPTIONS: DocenteCreateBody["cargo"][] = [
  "Directivo",
  "Administracion",
  "PTA",
  "PTC",
];

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<DocenteCreateBody>({
    nomina: 0,
    nombres: "",
    apellidos: "",
    correo: "",
    cargo: "PTC",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [openNomina, setOpenNomina] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<DocenteDetail | null>(
    null,
  );
  const [detailLoading, setDetailLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchDocentes();
  }, []);

  const fetchDocentes = async (query?: {
    nombre?: string;
    nomina?: string | number;
  }) => {
    setLoading(true);
    setError("");
    try {
      const data = await docenteGet(query);
      console.log("[docentes] response:", data);
      const list: Docente[] = data?.data?.Docentes ?? [];
      setDocentes(list);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          `Error ${err.response?.status ?? ""}: ${err.response?.data?.error ?? "No se pudo cargar la lista"}`,
        );
      } else {
        setError("Error inesperado al cargar docentes");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim() === "") {
        fetchDocentes();
      } else if (/^\d+$/.test(value.trim())) {
        fetchDocentes({ nomina: value.trim() });
      } else {
        fetchDocentes({ nombre: value.trim() });
      }
    }, 400);
  };

  const handleViewDetail = async (nomina: number) => {
    if (openNomina === nomina) {
      setOpenNomina(null);
      setSelectedDetail(null);
      return;
    }
    setOpenNomina(nomina);
    setDetailLoading(true);
    setSelectedDetail(null);
    try {
      const [docenteRes, horarioRes, statsRes] = await Promise.allSettled([
        docenteGetByNomina(nomina),
        horarioGetByDocente(nomina),
        calificacionesStatsByDocente(nomina),
      ]);

      const docenteData =
        docenteRes.status === "fulfilled"
          ? docenteRes.value?.data?.docente
          : null;
      const horario: HorarioEntry[] =
        horarioRes.status === "fulfilled"
          ? (horarioRes.value?.data?.horario ?? [])
          : [];
      const stats: DocenteStats | null =
        statsRes.status === "fulfilled"
          ? {
              promedio: statsRes.value?.data?.promedio,
              acreditados: statsRes.value?.data?.acreditados,
              reprobados: statsRes.value?.data?.reprobados,
              total: statsRes.value?.data?.total,
            }
          : null;

      setSelectedDetail({ docente: docenteData, horario, stats });
    } catch (err) {
      console.error("[docentes] detail fetch error", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      const res = await docenteCreate(formData);
      console.log("[docentes] create response:", res);
      setShowForm(false);
      setFormData({
        nomina: 0,
        nombres: "",
        apellidos: "",
        correo: "",
        cargo: "PTC",
      });
      await fetchDocentes();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.error ?? "Error al crear docente");
      } else {
        setFormError("Error inesperado");
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Docentes</h1>
          <p className="topbar-sub">
            {loading
              ? "Cargando..."
              : `${docentes.length} docentes registrados`}
          </p>
        </div>
        <div className="topbar-right">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "✕ Cancelar" : "+ Nuevo docente"}
          </button>
        </div>
      </div>

      {showForm && (
        <div
          style={{
            margin: "0 1.5rem",
            padding: "1.25rem",
            background: "var(--white)",
            border: "1px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            marginBottom: 8,
          }}
        >
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
            Registrar nuevo docente
          </p>
          {formError && (
            <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>
              {formError}
            </p>
          )}
          <form
            onSubmit={handleFormSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <label style={{ fontSize: 12, color: "var(--gray-600)" }}>
                Nómina
              </label>
              <input
                type="number"
                required
                className="search-input"
                style={{ width: "100%", marginTop: 4 }}
                value={formData.nomina || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nomina: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--gray-600)" }}>
                Nombres
              </label>
              <input
                type="text"
                required
                className="search-input"
                style={{ width: "100%", marginTop: 4 }}
                value={formData.nombres}
                onChange={(e) =>
                  setFormData({ ...formData, nombres: e.target.value })
                }
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--gray-600)" }}>
                Apellidos
              </label>
              <input
                type="text"
                required
                className="search-input"
                style={{ width: "100%", marginTop: 4 }}
                value={formData.apellidos}
                onChange={(e) =>
                  setFormData({ ...formData, apellidos: e.target.value })
                }
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--gray-600)" }}>
                Correo
              </label>
              <input
                type="email"
                required
                className="search-input"
                style={{ width: "100%", marginTop: 4 }}
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--gray-600)" }}>
                Cargo
              </label>
              <select
                required
                className="search-input"
                style={{ width: "100%", marginTop: 4 }}
                value={formData.cargo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cargo: e.target.value as DocenteCreateBody["cargo"],
                  })
                }
              >
                {CARGO_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={formLoading}
                style={{ width: "100%" }}
              >
                {formLoading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-area">
        <div className="table-card">
          <div className="table-header">
            <span className="table-title">Lista de docentes</span>
            <input
              className="search-input"
              placeholder="🔍 Buscar por nombre o nómina..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ padding: "1rem", color: "red" }}>
              {error} —{" "}
              <button onClick={() => fetchDocentes()}>Reintentar</button>
            </div>
          )}

          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Cargando docentes...
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nómina</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Cargo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docentes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: "2rem" }}
                    >
                      No se encontraron docentes
                    </td>
                  </tr>
                ) : (
                  docentes.map((d) => (
                    <>
                      <tr key={d.nomina}>
                        <td>{d.nomina}</td>
                        <td>
                          <strong>
                            {d.nombres} {d.apellidos}
                          </strong>
                        </td>
                        <td>{d.correo}</td>
                        <td>{d.cargo}</td>
                        <td>
                          <button
                            className="action-btn"
                            title="Ver detalle"
                            onClick={() => handleViewDetail(d.nomina)}
                          >
                            👁️
                          </button>
                        </td>
                      </tr>
                      {openNomina === d.nomina && (
                        <tr key={`detail-${d.nomina}`}>
                          <td
                            colSpan={5}
                            style={{
                              background: "var(--gray-50)",
                              padding: "1rem 1.5rem",
                            }}
                          >
                            {detailLoading ? (
                              <p style={{ fontSize: 13 }}>
                                Cargando detalle...
                              </p>
                            ) : selectedDetail ? (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: 16,
                                  fontSize: 13,
                                }}
                              >
                                <div>
                                  <strong>Horario</strong>
                                  {selectedDetail.horario.length === 0 ? (
                                    <p style={{ color: "var(--gray-500)" }}>
                                      Sin horario
                                    </p>
                                  ) : (
                                    <ul
                                      style={{
                                        marginTop: 8,
                                        paddingLeft: 0,
                                        listStyle: "none",
                                      }}
                                    >
                                      {selectedDetail.horario.map((h, i) => (
                                        <li key={i} style={{ marginBottom: 4 }}>
                                          <strong>{h.materia.nombre}</strong>
                                          {" — "}
                                          {h.inicio} {h.fin}
                                          {" – "}
                                          {h.dia}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                                <div>
                                  <strong>
                                    Estadísticas de calificaciones
                                  </strong>
                                  {!selectedDetail.stats ? (
                                    <p style={{ color: "var(--gray-500)" }}>
                                      Sin estadísticas
                                    </p>
                                  ) : (
                                    <div style={{ marginTop: 8 }}>
                                      <p>
                                        Promedio:{" "}
                                        <strong>
                                          {selectedDetail.stats.promedio?.toFixed(
                                            1,
                                          )}
                                        </strong>
                                      </p>
                                      <p>
                                        Acreditados:{" "}
                                        <strong>
                                          {selectedDetail.stats.acreditados}
                                        </strong>
                                      </p>
                                      <p>
                                        Reprobados:{" "}
                                        <strong>
                                          {selectedDetail.stats.reprobados}
                                        </strong>
                                      </p>
                                      <p>
                                        Total calificaciones:{" "}
                                        <strong>
                                          {selectedDetail.stats.total}
                                        </strong>
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : null}
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
              Mostrando {docentes.length} de {docentes.length} docentes
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
