'use client'
import { useState } from 'react'

// TODO: reemplazar con fetch a tu API
const docentesMock = [
  { id: 1, nombre: 'Dra. Laura Ramírez',  email: 'l.ramirez@utc.mx', tel: '998 123 4567', grupos: 3, tutorDe: 'TSU-DS-101', activo: true },
  { id: 2, nombre: 'Mtro. Ernesto López', email: 'e.lopez@utc.mx',   tel: '998 234 5678', grupos: 2, tutorDe: 'TSU-DS-201', activo: true },
  { id: 3, nombre: 'Mtro. Julio García',  email: 'j.garcia@utc.mx',  tel: '998 345 6789', grupos: 4, tutorDe: 'TSU-RD-101', activo: true },
  { id: 4, nombre: 'Ing. Roberto Torres', email: 'r.torres@utc.mx',  tel: '998 456 7890', grupos: 2, tutorDe: 'TSU-ME-101', activo: true },
  { id: 5, nombre: 'Mtra. Claudia Vega',  email: 'c.vega@utc.mx',   tel: '998 567 8901', grupos: 1, tutorDe: '—',          activo: false },
]

export default function DocentesPage() {
  const [search, setSearch] = useState('')

  const filtered = docentesMock.filter(d =>
    d.nombre.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Docentes</h1>
          <p className="topbar-sub">24 docentes registrados · 3 tutores activos</p>
        </div>
        <div className="topbar-right">
          <button className="btn btn-primary btn-sm">+ Nuevo docente</button>
        </div>
      </div>

      <div className="content-area">
        <div className="table-card">
          <div className="table-header">
            <span className="table-title">Lista de docentes</span>
            <input
              className="search-input"
              placeholder="🔍 Buscar docente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Grupos asignados</th>
                <th>Tutor de</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.nombre}</strong></td>
                  <td>{d.email}</td>
                  <td>{d.tel}</td>
                  <td style={{ textAlign: 'center' }}>{d.grupos}</td>
                  <td>{d.tutorDe}</td>
                  <td><span className={`badge ${d.activo ? 'badge-active' : 'badge-inactive'}`}>{d.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td>
                    <button className="action-btn" title="Editar">✏️</button>
                    <button className="action-btn" title="Ver grupos">👁️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span>Mostrando {filtered.length} de 24 docentes</span>
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
