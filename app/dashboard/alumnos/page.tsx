"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  alumnoGet,
  alumnoGetByMatricula,
  calificacionesGetByMatricula,
  horarioGetByAlumno,
} from "@/lib/api";

interface Alumno {
  matricula: number;
  nombres: string;
  apellidos: string;
  correo?: string;
  estado?: string;
  promedio_actual?: number;
  carrera?: number;
  grupo_id?: number;
  grupo_nom?: string;
}

interface Calificacion {
  matricula: number;
  materia: { nombre: string };
  unidad: number;
  calificacion: number;
  acreditado: boolean;
}

interface HorarioEntry {
  materia: { nombre: string };
  inicio: string;
  fin: string;
  dia: string;
}

interface AlumnoDetail {
  alumno: Alumno;
  calificaciones: Calificacion[];
  horario: HorarioEntry[];
}

export default function AlumnosPage() {
  const router = useRouter();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<AlumnoDetail | null>(
    null,
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [openMatricula, setOpenMatricula] = useState<number | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const fetchAlumnos = async (query?: {
    nombre?: string;
    matricula?: string | number;
  }) => {
    setLoading(true);
    setError("");
    try {
      const data = await alumnoGet(query);
      console.log("[alumnos] response:", data);
      const list: Alumno[] = data?.data?.Alumnos ?? [];
      setAlumnos(list);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          `Error ${err.response?.status ?? ""}: ${err.response?.data?.error ?? "No se pudo cargar la lista"}`,
        );
      } else {
        setError("Error inesperado al cargar alumnos");
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
        fetchAlumnos();
      } else if (/^\d+$/.test(value.trim())) {
        fetchAlumnos({ matricula: value.trim() });
      } else {
        fetchAlumnos({ nombre: value.trim() });
      }
    }, 400);
  };

  const handleViewDetail = async (matricula: number) => {
    if (openMatricula === matricula) {
      setOpenMatricula(null);
      setSelectedDetail(null);
      return;
    }
    setOpenMatricula(matricula);
    setDetailLoading(true);
    setSelectedDetail(null);
    try {
      const [alumnoRes, califRes, horarioRes] = await Promise.allSettled([
        alumnoGetByMatricula(matricula),
        calificacionesGetByMatricula(matricula),
        horarioGetByAlumno(matricula),
      ]);

      const alumnoData =
        alumnoRes.status === "fulfilled" ? alumnoRes.value?.data?.alumno : null;
      const califs: Calificacion[] =
        califRes.status === "fulfilled"
          ? (califRes.value?.data?.calificaciones ?? [])
          : [];
      const horario: HorarioEntry[] =
        horarioRes.status === "fulfilled"
          ? (horarioRes.value?.data?.horario ?? [])
          : [];

      setSelectedDetail({
        alumno: alumnoData,
        calificaciones: califs,
        horario,
      });
    } catch (err) {
      console.error("[alumnos] detail fetch error", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const estadoBadgeClass = (estado?: string) => {
    if (estado === "Activo") return "badge-active";
    if (estado === "Baja Temporal") return "badge-inactive";
    if (estado === "Baja Definitiva") return "badge-baja";
    return "";
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Alumnos</h1>
          <p className="topbar-sub">
            {loading ? "Cargando..." : `${alumnos.length} alumnos`}
          </p>
        </div>
        <div className="topbar-right">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => router.push("/dashboard/bajas")}
          >
            📋 Histórico de Bajas
          </button>
          <button className="btn btn-outline btn-sm">⬇ Exportar</button>
          <button className="btn btn-primary btn-sm">+ Nuevo alumno</button>
        </div>
      </div>

      <div className="content-area">
        <div className="table-card">
          <div className="table-header">
            <span className="table-title">Lista de alumnos</span>
            <input
              className="search-input"
              placeholder="🔍 Buscar por nombre o matrícula..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ padding: "1rem", color: "red" }}>
              {error} —{" "}
              <button onClick={() => fetchAlumnos()}>Reintentar</button>
            </div>
          )}

          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Cargando alumnos...
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Grupo</th>
                  <th>Estado</th>
                  <th>Promedio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ textAlign: "center", padding: "2rem" }}
                    >
                      No se encontraron alumnos
                    </td>
                  </tr>
                ) : (
                  alumnos.map((a) => (
                    <>
                      <tr key={a.matricula}>
                        <td>
                          <code>{a.matricula}</code>
                        </td>
                        <td>
                          <strong>
                            {a.nombres} {a.apellidos}
                          </strong>
                        </td>
                        <td>{a.correo ?? "—"}</td>
                        <td>{a.grupo_nom ?? "—"}</td>
                        <td>
                          {a.estado ? (
                            <span
                              className={`badge ${estadoBadgeClass(a.estado)}`}
                            >
                              {a.estado}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          {a.promedio_actual !== undefined
                            ? a.promedio_actual.toFixed(1)
                            : "—"}
                        </td>
                        <td>
                          <button
                            className="action-btn"
                            title="Ver detalle"
                            onClick={() => handleViewDetail(a.matricula)}
                          >
                            👁️
                          </button>
                          <button
                            className="action-btn"
                            title="Editar alumno"
                            onClick={() =>
                              router.push(`/dashboard/alumno/${a.matricula}`)
                            }
                          >
                            ✏️
                          </button>
                        </td>
                      </tr>
                      {openMatricula === a.matricula && (
                        <tr key={`detail-${a.matricula}`}>
                          <td
                            colSpan={7}
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
                                  <strong>Calificaciones</strong>
                                  {selectedDetail.calificaciones.length ===
                                  0 ? (
                                    <p style={{ color: "var(--gray-500)" }}>
                                      Sin calificaciones
                                    </p>
                                  ) : (
                                    <table
                                      style={{ width: "100%", marginTop: 8 }}
                                    >
                                      <thead>
                                        <tr>
                                          <th
                                            style={{
                                              textAlign: "left",
                                              fontWeight: 600,
                                            }}
                                          >
                                            Materia
                                          </th>
                                          <th>Unidad</th>
                                          <th>Calificación</th>
                                          <th>Acreditado</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedDetail.calificaciones.map(
                                          (c, i) => (
                                            <tr key={i}>
                                              <td>{c.materia.nombre}</td>
                                              <td
                                                style={{ textAlign: "center" }}
                                              >
                                                {c.unidad}
                                              </td>
                                              <td
                                                style={{ textAlign: "center" }}
                                              >
                                                {c.calificacion}
                                              </td>
                                              <td
                                                style={{ textAlign: "center" }}
                                              >
                                                {c.acreditado ? "✅" : "❌"}
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                      </tbody>
                                    </table>
                                  )}
                                </div>
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
                                          {" — "} {h.dia} {h.inicio} {" – "} {h.fin}
                                        </li>
                                      ))}
                                    </ul>
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
            <span>Mostrando {alumnos.length} alumnos</span>
          </div>
        </div>
      </div>
    </>
  );
}
