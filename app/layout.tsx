import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UT Cancún – Gestión División Tecnología',
  description: 'Sistema de gestión de grupos, alumnos y docentes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
