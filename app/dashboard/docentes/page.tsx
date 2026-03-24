"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Docente {
  nomina: number;
  nombres: string;
  apellidos: string;
  correo: string;
  cargo: string;
}

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocentes();
  }, []);

  const fetchDocentes = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Llama al proxy local → sin CORS
      // El proxy (route.ts) se encarga de hablar con Supabase desde el servidor
      const { data } = await axios.get(
        API_URL + "/docente/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("API response:", data);
      const list = Array.isArray(data) ? data : data?.data?.Docentes ?? data?.Docentes ?? [];
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
          <button className="btn btn-primary btn-sm">+ Nuevo docente</button>
        </div>
      </div>

      <div className="content-area">
        <div className="table-card">
          <div className="table-header">
            <span className="table-title">Lista de docentes</span>
          </div>

          {error && (
            <div style={{ padding: "1rem", color: "red" }}>
              {error} — <button onClick={fetchDocentes}>Reintentar</button>
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
                        <button className="action-btn" title="Editar">
                          ✏️
                        </button>
                        <button className="action-btn" title="Ver grupos">
                          👁️
                        </button>
                      </td>
                    </tr>
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
