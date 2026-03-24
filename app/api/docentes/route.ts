// Ubicación: app/api/docentes/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.SUPABASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const authHeader = request.headers.get("Authorization") ?? "";

    const { data } = await axios.post(
      BASE_URL + "/functions/v1/docente/get",
      body,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      },
    );

    // Respuesta: { result, msg, data: { Docentes: [...] } }
    return NextResponse.json(data.data.Docentes);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { error: err.response?.data ?? "Error al obtener docentes" },
        { status: err.response?.status ?? 500 },
      );
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
