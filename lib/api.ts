import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function authLogin(email: string, password: string) {
  console.log("[API] auth/login - called");
  const { data } = await axios.post(
    API_URL + "/auth/login",
    { email, password },
    { headers: { "Content-Type": "application/json" } },
  );
  return data;
}

export async function authLogout() {
  console.log("[API] auth/logout - called");
  const { data } = await axios.post(
    API_URL + "/auth/logout",
    {},
    { headers: { ...authHeaders(), "Content-Type": "application/json" } },
  );
  return data;
}

// ─── ALUMNO ──────────────────────────────────────────────────────────────────

export async function alumnoGetWarns() {
  console.log("[API] alumno/getwarns - called");
  const { data } = await axios.get(API_URL + "/alumno/getwarns", {
    headers: authHeaders(),
  });
  return data;
}

export async function alumnoGet(query?: { nombre?: string; matricula?: string | number }) {
  console.log("[API] alumno/get - called", query ?? "");
  const { data } = await axios.get(API_URL + "/alumno/get", {
    headers: authHeaders(),
    params: query,
  });
  return data;
}

export async function alumnoGetByMatricula(matricula: number) {
  console.log("[API] alumno/get/:matricula - called", matricula);
  const { data } = await axios.get(API_URL + `/alumno/get/${matricula}`, {
    headers: authHeaders(),
  });
  return data;
}

// ─── DOCENTE ─────────────────────────────────────────────────────────────────

export interface DocenteCreateBody {
  nomina: number;
  nombres: string;
  apellidos: string;
  correo: string;
  cargo: "Directivo" | "Administracion" | "PTA" | "PTC";
}

export async function docenteCreate(body: DocenteCreateBody) {
  console.log("[API] docente/create - called");
  const { data } = await axios.post(API_URL + "/docente/create", body, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  return data;
}

export async function docenteGet(query?: { nombre?: string; nomina?: string | number }) {
  console.log("[API] docente/get - called", query ?? "");
  const { data } = await axios.get(API_URL + "/docente/get", {
    headers: authHeaders(),
    params: query,
  });
  return data;
}

export async function docenteGetByNomina(nomina: number) {
  console.log("[API] docente/get/:nomina - called", nomina);
  const { data } = await axios.get(API_URL + `/docente/get/${nomina}`, {
    headers: authHeaders(),
  });
  return data;
}

// ─── CARRERA ─────────────────────────────────────────────────────────────────

export async function carreraGetAll() {
  console.log("[API] carrera/getall - called");
  const { data } = await axios.get(API_URL + "/carrera/getall", {
    headers: authHeaders(),
  });
  return data;
}

export async function carreraGetById(id: number) {
  console.log("[API] carrera/:id - called", id);
  const { data } = await axios.get(API_URL + `/carrera/${id}`, {
    headers: authHeaders(),
  });
  return data;
}

// ─── GRUPO ───────────────────────────────────────────────────────────────────

export async function grupoGetAll() {
  console.log("[API] grupo/getall - called");
  const { data } = await axios.get(API_URL + "/grupo/getall", {
    headers: authHeaders(),
  });
  return data;
}

export async function grupoGetDetails() {
  console.log("[API] grupo/getdetails - called");
  const { data } = await axios.get(API_URL + "/grupo/getdetails", {
    headers: authHeaders(),
  });
  return data;
}

// ─── HORARIO ─────────────────────────────────────────────────────────────────

export async function horarioGetByDocente(nomina: number) {
  console.log("[API] horario/getby/docente/:docente - called", nomina);
  const { data } = await axios.get(
    API_URL + `/horario/getby/docente/${nomina}`,
    { headers: authHeaders() },
  );
  return data;
}

export async function horarioGetByAlumno(matricula: number) {
  console.log("[API] horario/getby/alumno/:alumno - called", matricula);
  const { data } = await axios.get(
    API_URL + `/horario/getby/alumno/${matricula}`,
    { headers: authHeaders() },
  );
  return data;
}

export async function horarioGetByGrupo(grupoId: number) {
  console.log("[API] horario/getby/grupo/:grupo - called", grupoId);
  const { data } = await axios.get(
    API_URL + `/horario/getby/grupo/${grupoId}`,
    { headers: authHeaders() },
  );
  return data;
}

// ─── CALIFICACIONES ──────────────────────────────────────────────────────────

export async function calificacionesGetByMatricula(matricula: number) {
  console.log("[API] calificaciones/getby/:matricula - called", matricula);
  const { data } = await axios.get(
    API_URL + `/calificaciones/getby/${matricula}`,
    { headers: authHeaders() },
  );
  return data;
}

export async function calificacionesStatsByGrupo(grupoId: number) {
  console.log("[API] calificaciones/getstatsby/grupo/:grupo - called", grupoId);
  const { data } = await axios.get(
    API_URL + `/calificaciones/getstatsby/grupo/${grupoId}`,
    { headers: authHeaders() },
  );
  return data;
}

export async function calificacionesStatsByCarrera(carreraId: number) {
  console.log("[API] calificaciones/getstatsby/carrera/:carrera - called", carreraId);
  const { data } = await axios.get(
    API_URL + `/calificaciones/getstatsby/carrera/${carreraId}`,
    { headers: authHeaders() },
  );
  return data;
}

export async function calificacionesStatsByDocente(nomina: number) {
  console.log("[API] calificaciones/getstatsby/docente/:docente - called", nomina);
  const { data } = await axios.get(
    API_URL + `/calificaciones/getstatsby/docente/${nomina}`,
    { headers: authHeaders() },
  );
  return data;
}
