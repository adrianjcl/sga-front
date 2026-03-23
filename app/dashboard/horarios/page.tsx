'use client'
import { useState } from 'react'
import styles from './horarios.module.css'

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const horas = ['7:00–9:00', '9:00–11:00', '11:00–13:00', '13:00–15:00']

// TODO: reemplazar con fetch a tu API
// Formato: [hora][dia] → clase | null
const horarioMock: Record<string, Record<string, { materia: string; docente: string; aula: string; tipo: 'teal' | 'green' | 'gray' } | null>> = {
  '7:00–9:00':   { Lunes: { materia: 'Programación I', docente: 'Dra. Ramírez', aula: 'A-101', tipo: 'teal' }, Martes: null, Miércoles: { materia: 'Programación I', docente: 'Dra. Ramírez', aula: 'A-101', tipo: 'teal' }, Jueves: null, Viernes: { materia: 'Programación I', docente: 'Dra. Ramírez', aula: 'A-101', tipo: 'teal' } },
  '9:00–11:00':  { Lunes: null, Martes: { materia: 'Matemáticas', docente: 'Mtro. López', aula: 'B-204', tipo: 'green' }, Miércoles: null, Jueves: { materia: 'Matemáticas', docente: 'Mtro. López', aula: 'B-204', tipo: 'green' }, Viernes: null },
  '11:00–13:00': { Lunes: { materia: 'Inglés Técnico', docente: 'Mtra. Vega', aula: 'C-310', tipo: 'gray' }, Martes: null, Miércoles: null, Jueves: { materia: 'Inglés Técnico', docente: 'Mtra. Vega', aula: 'C-310', tipo: 'gray' }, Viernes: null },
  '13:00–15:00': { Lunes: null, Martes: { materia: 'Base de Datos', docente: 'Ing. Torres', aula: 'Lab-2', tipo: 'teal' }, Miércoles: { materia: 'Base de Datos', docente: 'Ing. Torres', aula: 'Lab-2', tipo: 'teal' }, Jueves: null, Viernes: { materia: 'Base de Datos', docente: 'Ing. Torres', aula: 'Lab-2', tipo: 'teal' } },
}

const grupos = ['TSU-DS-101', 'TSU-DS-201', 'TSU-RD-101', 'ING-SW-301']

export default function HorariosPage() {
  const [grupoSel, setGrupoSel] = useState(grupos[0])

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Horarios</h1>
          <p className="topbar-sub">Grupo: {grupoSel} · Matutino</p>
        </div>
        <div className="topbar-right">
          <select
            value={grupoSel}
            onChange={e => setGrupoSel(e.target.value)}
            style={{ padding: '7px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', fontSize: 13, background: 'var(--white)', fontFamily: 'inherit' }}
          >
            {grupos.map(g => <option key={g}>{g}</option>)}
          </select>
          {/* TODO: abrir modal de agregar clase */}
          <button className="btn btn-primary btn-sm">+ Agregar clase</button>
        </div>
      </div>

      <div className="content-area">
        <div className="table-card" style={{ overflowX: 'auto' }}>
          <div style={{ padding: 16, minWidth: 640 }}>
            <div className={styles.grid}>
              <div className={styles.head}>Hora</div>
              {dias.map(d => <div key={d} className={styles.head}>{d}</div>)}

              {horas.map(h => (
                <>
                  <div key={`t-${h}`} className={styles.time}>{h}</div>
                  {dias.map(d => {
                    const clase = horarioMock[h]?.[d]
                    return (
                      <div key={`${h}-${d}`} className={styles.cell}>
                        {clase && (
                          <div className={`clase ${clase.tipo === 'green' ? 'clase-green' : clase.tipo === 'gray' ? 'clase-gray' : ''}`}>
                            <strong>{clase.materia}</strong><br />
                            <small>{clase.docente} · {clase.aula}</small>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
