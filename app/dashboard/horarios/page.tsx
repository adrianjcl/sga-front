"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { grupoGetAll, horarioGetByGrupo } from "@/lib/api";
import styles from "./horarios.module.css";

interface Grupo {
  id: number;
  nom: string;
  salon: string;
  tutor: number | null;
}

interface HorarioEntry {
  materia: { nombre: string };
  dia: string;
  inicio: string;
  fin: string;
}


const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

type GridCell = { materia: string } | null;
type HorarioGrid = Record<string, Record<string, GridCell>>;

function buildGrid(entries: HorarioEntry[]): { grid: HorarioGrid; horas: string[] } {
  const horasSet = new Set<string>();
  const grid: HorarioGrid = {};

  for (const entry of entries) {
    const day = entry.dia;
    if (!DIAS.includes(day)) continue;
    const horaKey = `${entry.inicio}–${entry.fin}`;
    horasSet.add(horaKey);
    if (!grid[horaKey]) grid[horaKey] = {};
    grid[horaKey][day] = { materia: entry.materia.nombre };
  }

  const horas = Array.from(horasSet).sort();
  return { grid, horas };
}

export default function HorariosPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoSel, setGrupoSel] = useState<number | null>(null);
  const [horario, setHorario] = useState<HorarioEntry[]>([]);
  const [gruposLoading, setGruposLoading] = useState(true);
  const [horarioLoading, setHorarioLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGrupos();
    // fetchGrupos is defined in component scope and stable; only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGrupos = async () => {
    setGruposLoading(true);
    setError("");
    try {
      const data = await grupoGetAll();
      console.log("[horarios] grupos response:", data);
      const list: Grupo[] = data?.data?.Grupos ?? [];
      setGrupos(list);
      if (list.length > 0) {
        setGrupoSel(list[0].id);
        fetchHorario(list[0].id);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error cargando grupos: ${err.response?.status ?? ""}`);
      }
    } finally {
      setGruposLoading(false);
    }
  };

  const fetchHorario = async (grupoId: number) => {
    setHorarioLoading(true);
    setHorario([]);
    try {
      const data = await horarioGetByGrupo(grupoId);
      console.log("[horarios] horario response:", data);
      setHorario(data?.data?.horario ?? []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("[horarios] fetch error:", err.response?.status);
      }
      setHorario([]);
    } finally {
      setHorarioLoading(false);
    }
  };

  const handleGrupoChange = (id: number) => {
    setGrupoSel(id);
    fetchHorario(id);
  };

  const selectedGrupo = grupos.find((g) => g.id === grupoSel);
  const { grid, horas } = buildGrid(horario);

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Horarios</h1>
          <p className="topbar-sub">
            {selectedGrupo ? `Grupo: ${selectedGrupo.nom}` : "Selecciona un grupo"}
          </p>
        </div>
        <div className="topbar-right">
          {gruposLoading ? (
            <span style={{ fontSize: 13, color: "var(--gray-500)" }}>
              Cargando grupos...
            </span>
          ) : (
            <select
              value={grupoSel ?? ""}
              onChange={(e) => handleGrupoChange(Number(e.target.value))}
              style={{
                padding: "7px 12px",
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius)",
                fontSize: 13,
                background: "var(--white)",
                fontFamily: "inherit",
              }}
            >
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nom}
                </option>
              ))}
            </select>
          )}
          <button className="btn btn-primary btn-sm">+ Agregar clase</button>
        </div>
      </div>

      {error && (
        <div
          style={{ margin: "0 1.5rem", padding: "0.75rem", color: "red", fontSize: 13 }}
        >
          {error}
        </div>
      )}

      <div className="content-area">
        <div className="table-card" style={{ overflowX: "auto" }}>
          <div style={{ padding: 16, minWidth: 640 }}>
            {horarioLoading ? (
              <div style={{ padding: "2rem", textAlign: "center", fontSize: 13 }}>
                Cargando horario...
              </div>
            ) : horas.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  fontSize: 13,
                  color: "var(--gray-500)",
                }}
              >
                No hay clases registradas para este grupo
              </div>
            ) : (
              <div className={styles.grid}>
                <div className={styles.head}>Hora</div>
                {DIAS.map((d) => (
                  <div key={d} className={styles.head}>
                    {d}
                  </div>
                ))}

                {horas.map((h) => (
                  <>
                    <div key={`t-${h}`} className={styles.time}>
                      {h}
                    </div>
                    {DIAS.map((d) => {
                      const cell = grid[h]?.[d] ?? null;
                      return (
                        <div key={`${h}-${d}`} className={styles.cell}>
                          {cell && (
                            <div className="clase">
                              <strong>{cell.materia}</strong>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
