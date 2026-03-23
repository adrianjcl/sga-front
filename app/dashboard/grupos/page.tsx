'use client'
import { useState } from 'react'

// TODO: reemplazar con fetch a tu API
const gruposMock = [
  { id: 1, clave: 'TSU-DS-101', carrera: 'Desarrollo de Software', cuatrimestre: '1°', turno: 'Matutino',  tutor: 'Dra. Ramírez', alumnos: 32, activo: true },
  { id: 2, clave: 'TSU-DS-201', carrera: 'Desarrollo de Software', cuatrimestre: '2°', turno: 'Vespertino', tutor: 'Mtro. López',   alumnos: 28, activo: true },
  { id: 3, clave: 'TSU-RD-101', carrera: 'Redes y Telecomunicaciones', cuatrimestre: '1°', turno: 'Matutino', tutor: 'Mtro. García', alumnos: 30, activo: true },
  { id: 4, clave: 'ING-SW-301', carrera: 'Ingeniería en Software',  cuatrimestre: '5°', turno: 'Vespertino', tutor: 'Sin asignar',  alumnos: 25, activo: true },
  { id: 5, clave: 'TSU-ME-101', carrera: 'Mecatrónica',             cuatrimestre: '1°', turno: 'Matutino',  tutor: 'Ing. Torres',  alumnos: 27, activo: true },
]

export default function GruposPage() {
  const [search, setSearch] = useState('')

  const filtered = gruposMock.filter(g =>
    g.clave.toLowerCase().includes(search.toLowerCase()) ||
    g.carrera.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Grupos</h1>
          <p className="topbar-sub">12 grupos activos · Ciclo 2025-A</p>
        </div>
        <div className="topbar-right">
          {/* TODO: abrir modal de creación */}
          <button className="btn btn-primary btn-sm">+ Nuevo grupo</button>
        </div>
      </div>

      <div className="content-area">
        <div className="table-card">
          <div className="table-header">
            <span className="table-title">Todos los grupos</span>
            <input
              className="search-input"
              placeholder="🔍 Buscar grupo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Clave</th>
                <th>Carrera</th>
                <th>Cuatrimestre</th>
                <th>Turno</th>
                <th>Tutor</th>
                <th>Alumnos</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => (
                <tr key={g.id}>
                  <td><strong>{g.clave}</strong></td>
                  <td>{g.carrera}</td>
                  <td>{g.cuatrimestre}</td>
                  <td>
                    <span className={`badge ${g.turno === 'Matutino' ? 'badge-matutino' : 'badge-vespertino'}`}>
                      {g.turno}
                    </span>
                  </td>
                  <td>{g.tutor}</td>
                  <td>{g.alumnos}</td>
                  <td><span className={`badge ${g.activo ? 'badge-active' : 'badge-inactive'}`}>{g.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td>
                    {/* TODO: conectar con handlers de editar/ver */}
                    <button className="action-btn" title="Editar">✏️</button>
                    <button className="action-btn" title="Ver detalle">👁️</button>
                    <button className="action-btn" title="Eliminar">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span>Mostrando {filtered.length} de {gruposMock.length} grupos</span>
            <div className="page-btns">
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
