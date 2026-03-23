'use client'
import { useState } from 'react'

// TODO: reemplazar con fetch a tu API
const alumnosMock = [
  { id: 1, matricula: '20230001', nombre: 'Ana González Pérez',   grupo: 'TSU-DS-101', carrera: 'Des. de Software', email: 'a.gonzalez@utc.mx', estatus: 'activo' },
  { id: 2, matricula: '20230045', nombre: 'Carlos Medina Ruiz',   grupo: 'TSU-RD-101', carrera: 'Redes',           email: 'c.medina@utc.mx',   estatus: 'activo' },
  { id: 3, matricula: '20220089', nombre: 'María Torres Luna',    grupo: 'ING-SW-301', carrera: 'Ing. Software',   email: 'm.torres@utc.mx',   estatus: 'baja'   },
  { id: 4, matricula: '20230102', nombre: 'Diego Sánchez Mora',   grupo: 'TSU-DS-201', carrera: 'Des. de Software', email: 'd.sanchez@utc.mx',  estatus: 'activo' },
  { id: 5, matricula: '20230156', nombre: 'Sofía Herrera Díaz',   grupo: 'TSU-ME-101', carrera: 'Mecatrónica',     email: 's.herrera@utc.mx',  estatus: 'activo' },
]

export default function AlumnosPage() {
  const [search, setSearch] = useState('')

  const filtered = alumnosMock.filter(a =>
    a.nombre.toLowerCase().includes(search.toLowerCase()) ||
    a.matricula.includes(search) ||
    a.grupo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Alumnos</h1>
          <p className="topbar-sub">347 alumnos registrados</p>
        </div>
        <div className="topbar-right">
          {/* TODO: conectar exportación con tu API */}
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
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nombre</th>
                <th>Grupo</th>
                <th>Carrera</th>
                <th>Email</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><code>{a.matricula}</code></td>
                  <td>{a.nombre}</td>
                  <td>{a.grupo}</td>
                  <td>{a.carrera}</td>
                  <td>{a.email}</td>
                  <td>
                    <span className={`badge ${
                      a.estatus === 'activo' ? 'badge-active' :
                      a.estatus === 'baja'   ? 'badge-baja'   : 'badge-inactive'
                    }`}>
                      {a.estatus === 'activo' ? 'Activo' : a.estatus === 'baja' ? 'Baja' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" title="Editar">✏️</button>
                    {a.estatus === 'activo'
                      ? <button className="action-btn" title="Dar de baja">🚫</button>
                      : <button className="action-btn" title="Reactivar">↩️</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span>Mostrando {filtered.length} de 347 alumnos</span>
            <div className="page-btns">
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">…</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
