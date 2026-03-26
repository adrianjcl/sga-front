"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  alumnoGetExtended,
  bajasCreate,
  type AlumnoExtended,
} from "@/lib/api";

export default function AlumnoEditPage() {
  const params = useParams();
  const router = useRouter();
  const matricula = Number(params.matricula);

  // ── Form state
  // TODO: restrict editing to Directivo/Administracion
  const [form, setForm] = useState<AlumnoExtended>({
    Matricula: matricula,
    Nombre: "",
    Genero: "",
    ProgramaEducativo: "",
    Grupo: "",
    Turno: "",
    Nivel: "",
    Cuatrimestre: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalTipo, setModalTipo] = useState<
    "" | "Baja Temporal" | "Baja Definitiva"
  >("");
  const [modalMotivo, setModalMotivo] = useState("");
  const [modalComentarios, setModalComentarios] = useState("");
  const [modalMatriculaConfirm, setModalMatriculaConfirm] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await alumnoGetExtended(matricula);
        console.log("[alumno-edit] get-extended response:", res);
        if (res?.data) {
          setForm(res.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            `Error ${err.response?.status ?? ""}: ${err.response?.data?.error ?? "No se pudo cargar el alumno"}`,
          );
        } else {
          setError("Error inesperado al cargar el alumno");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [matricula]);

  const handleFieldChange = (
    field: keyof AlumnoExtended,
    value: string | number,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = () => {
    // TODO: call save endpoint when available (e.g. PUT /alumno/update/:matricula)
    alert("Guardar Cambios: endpoint no disponible aún.");
  };

  const handleConfirmarBaja = async () => {
    setModalError("");
    setModalSuccess("");

    if (String(modalMatriculaConfirm).trim() !== String(matricula)) {
      setModalError("La matrícula ingresada no coincide.");
      return;
    }
    if (!modalTipo) {
      setModalError("Selecciona el tipo de baja.");
      return;
    }
    if (!modalMotivo.trim()) {
      setModalError("El motivo es requerido.");
      return;
    }

    setModalLoading(true);
    try {
      const res = await bajasCreate({
        matricula,
        tipoDeBaja: modalTipo,
        motivo: modalMotivo,
        comentarios: modalComentarios || undefined,
      });
      console.log("[alumno-edit] bajas/create response:", res);
      setModalSuccess(res?.msg ?? "Baja registrada exitosamente.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setModalError(
          err.response?.data?.error ?? "Error al registrar la baja.",
        );
      } else {
        setModalError("Error inesperado al registrar la baja.");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleCancelarModal = () => {
    setShowModal(false);
    setModalTipo("");
    setModalMotivo("");
    setModalComentarios("");
    setModalMatriculaConfirm("");
    setModalPassword("");
    setModalError("");
    setModalSuccess("");
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Cargando datos del alumno...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "var(--red)" }}>
        {error}{" "}
        <button
          className="btn btn-outline btn-sm"
          onClick={() => router.push("/dashboard/alumnos")}
          style={{ marginLeft: 8 }}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ── TOP BAR ── */}
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Editar Alumno</h1>
          <p className="topbar-sub">Matrícula: {matricula}</p>
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

      {/* ── FORM ── */}
      <div className="content-area">
        <div
          style={{
            background: "var(--white)",
            border: "1px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            maxWidth: 700,
          }}
        >
          {/* Matrícula — readonly */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--gray-600)",
                display: "block",
                marginBottom: 4,
              }}
            >
              Matrícula
            </label>
            <input
              type="number"
              readOnly
              className="search-input"
              style={{
                width: "100%",
                background: "var(--gray-50)",
                cursor: "not-allowed",
              }}
              value={form.Matricula}
            />
          </div>

          {/* Nombre */}
          {/* TODO: restrict to Directivo/Administracion */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--gray-600)",
                display: "block",
                marginBottom: 4,
              }}
            >
              Nombre
            </label>
            <input
              type="text"
              className="search-input"
              style={{ width: "100%" }}
              value={form.Nombre}
              onChange={(e) => handleFieldChange("Nombre", e.target.value)}
            />
          </div>

          {/* Género */}
          {/* TODO: restrict to Directivo/Administracion */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--gray-600)",
                display: "block",
                marginBottom: 4,
              }}
            >
              Género
            </label>
            <input
              type="text"
              className="search-input"
              style={{ width: "100%" }}
              value={form.Genero}
              onChange={(e) => handleFieldChange("Genero", e.target.value)}
            />
          </div>

          {/* Programa Educativo */}
          {/* TODO: restrict to Directivo/Administracion */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--gray-600)",
                display: "block",
                marginBottom: 4,
              }}
            >
              Programa Educativo
            </label>
            <input
              type="text"
              className="search-input"
              style={{ width: "100%" }}
              value={form.ProgramaEducativo}
              onChange={(e) =>
                handleFieldChange("ProgramaEducativo", e.target.value)
              }
            />
          </div>

          {/* Grupo */}
          {/* TODO: restrict to Directivo/Administracion */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--gray-600)",
                display: "block",
                marginBottom: 4,
              }}
            >
              Grupo
            </label>
            <input
              type="text"
              className="search-input"
              style={{ width: "100%" }}
              value={form.Grupo}
              onChange={(e) => handleFieldChange("Grupo", e.target.value)}
            />
          </div>

          {/* Turno */}
          {/* TODO: restrict to Directivo/Administracion */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--gray-600)",
                display: "block",
                marginBottom: 4,
              }}
            >
              Turno
            </label>
            <input
              type="text"
              className="search-input"
              style={{ width: "100%" }}
              value={form.Turno}
              onChange={(e) => handleFieldChange("Turno", e.target.value)}
            />
          </div>

          {/* Nivel */}
          {/* TODO: restrict to Directivo/Administracion */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--gray-600)",
                display: "block",
                marginBottom: 4,
              }}
            >
              Nivel
            </label>
            <input
              type="text"
              className="search-input"
              style={{ width: "100%" }}
              value={form.Nivel}
              onChange={(e) => handleFieldChange("Nivel", e.target.value)}
            />
          </div>

          {/* Cuatrimestre */}
          {/* TODO: restrict to Directivo/Administracion */}
          <div style={{ marginBottom: 28 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--gray-600)",
                display: "block",
                marginBottom: 4,
              }}
            >
              Cuatrimestre
            </label>
            <input
              type="number"
              className="search-input"
              style={{ width: "100%" }}
              value={form.Cuatrimestre}
              onChange={(e) =>
                handleFieldChange("Cuatrimestre", Number(e.target.value))
              }
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            {/* Guardar Cambios */}
            <button
              onClick={handleGuardar}
              style={{
                padding: "9px 20px",
                borderRadius: "var(--radius)",
                border: "2px solid var(--green)",
                background: "var(--green)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--green)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--green)";
                e.currentTarget.style.color = "#fff";
              }}
            >
              Guardar Cambios
            </button>

            {/* Dar de baja */}
            {/* TODO: restrict to Directivo/Administracion */}
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: "9px 20px",
                borderRadius: "var(--radius)",
                border: "2px solid var(--red)",
                background: "var(--red)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--red)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--red)";
                e.currentTarget.style.color = "#fff";
              }}
            >
              Dar de baja
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
              width: "100%",
              maxWidth: 440,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 16,
                color: "var(--red)",
              }}
            >
              Dar de Baja
            </h2>

            {/* TipoDeBaja */}
            <select
              className="search-input"
              style={{ width: "100%", marginBottom: 12 }}
              value={modalTipo}
              onChange={(e) =>
                setModalTipo(
                  e.target.value as "" | "Baja Temporal" | "Baja Definitiva",
                )
              }
            >
              <option value="" disabled>
                Tipo de baja
              </option>
              <option value="Baja Temporal">Baja Temporal</option>
              <option value="Baja Definitiva">Baja Definitiva</option>
            </select>

            {/* Motivo */}
            <input
              type="text"
              className="search-input"
              style={{ width: "100%", marginBottom: 12 }}
              placeholder="Motivo de baja"
              value={modalMotivo}
              onChange={(e) => setModalMotivo(e.target.value)}
            />

            {/* Comentarios */}
            <textarea
              className="search-input"
              style={{ width: "100%", marginBottom: 12, minHeight: 72, resize: "vertical" }}
              placeholder="Comentarios (opcional)"
              value={modalComentarios}
              onChange={(e) => setModalComentarios(e.target.value)}
            />

            {/* Confirmation notice */}
            <span
              style={{
                fontSize: 12,
                color: "var(--gray-600)",
                display: "block",
                marginBottom: 10,
              }}
            >
              Confirma la baja escribiendo la matrícula del estudiante y tu
              contraseña
            </span>

            {/* Matrícula confirm */}
            <input
              type="text"
              className="search-input"
              style={{ width: "100%", marginBottom: 12 }}
              placeholder="Matrícula del estudiante"
              value={modalMatriculaConfirm}
              onChange={(e) => setModalMatriculaConfirm(e.target.value)}
            />

            {/* Contraseña — UI-only, not sent to API */}
            <input
              type="password"
              className="search-input"
              style={{ width: "100%", marginBottom: 16 }}
              placeholder="Contraseña"
              value={modalPassword}
              onChange={(e) => setModalPassword(e.target.value)}
            />

            {/* Error / success */}
            {modalError && (
              <p
                style={{ color: "var(--red)", fontSize: 13, marginBottom: 10 }}
              >
                {modalError}
              </p>
            )}
            {modalSuccess && (
              <p
                style={{
                  color: "var(--green)",
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                {modalSuccess}
              </p>
            )}

            {/* Modal buttons */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleCancelarModal}
                disabled={modalLoading}
              >
                Cancelar
              </button>
              <button
                disabled={modalLoading || !!modalSuccess}
                onClick={handleConfirmarBaja}
                style={{
                  padding: "5px 14px",
                  borderRadius: "var(--radius)",
                  border: "none",
                  background: "var(--red)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: modalLoading || !!modalSuccess ? "not-allowed" : "pointer",
                  opacity: modalLoading || !!modalSuccess ? 0.6 : 1,
                }}
              >
                {modalLoading ? "Procesando..." : "Confirmar baja"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
