/**
 * Application Routes Configuration
 *
 * Defines all protected routes in the application using React lazy loading
 * for code splitting and performance optimization.
 *
 * Each route object contains:
 * - path: URL path for the route
 * - name: Human-readable name for breadcrumbs
 * - element: Lazy-loaded React component
 * - exact: (optional) Requires exact path match
 *
 * @module routes
 */

import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/pages/dashboard/Dashboard'))
const MasterPegawai = React.lazy(() => import('./views/pages/master/Pegawai'))
const MasterDokter = React.lazy(() => import('./views/pages/master/Dokter'))
const MasterRuangan = React.lazy(() => import('./views/pages/master/Ruangan'))
const MasterJadwalDokter = React.lazy(() => import('./views/pages/master/JadwalDokter.jsx'))
const MasterTindakan = React.lazy(() => import('./views/pages/master/Tindakan.jsx'))
const MasterObat = React.lazy(() => import('./views/pages/master/Obat.jsx'))
const MasterUser = React.lazy(() => import('./views/pages/master/User.jsx'))
const RegistrasiPasien = React.lazy(() => import('./views/pages/registrasi/Pasien.jsx'))
const RegistrasiRuangan = React.lazy(() => import('./views/pages/registrasi/RegistrasiRuangan.jsx'))
const Registrasi = React.lazy(() => import('./views/pages/registrasi/Registrasi.jsx'))

/**
 * Array of route configuration objects
 *
 * @type {Array<Object>}
 * @property {string} path - URL path pattern
 * @property {string} name - Display name for breadcrumbs and navigation
 * @property {React.LazyExoticComponent} element - Lazy-loaded component
 * @property {boolean} [exact] - Whether to match path exactly
 *
 * @example
 * // Route renders when URL matches '/dashboard'
 * { path: '/dashboard', name: 'Dashboard', element: Dashboard }
 *
 * @example
 * // Route with exact match required
 * { path: '/components', name: 'Components', element: Cards, exact: true }
 */
export const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  { path: '/master/pegawai', name: 'Master Pegawai', element: MasterPegawai },
  { path: '/master/dokter', name: 'Master Dokter', element: MasterDokter },
  { path: '/master/ruangan', name: 'Master Ruangan', element: MasterRuangan },
  { path: '/master/jadwal-dokter', name: 'Master Jadwal Dokter', element: MasterJadwalDokter },
  { path: '/master/tindakan', name: 'Master Tindakan', element: MasterTindakan },
  { path: '/master/obat', name: 'Master Obat', element: MasterObat },

  { path: '/registrasi/pasien', name: 'Daftar Pasien', element: RegistrasiPasien },
  { path: '/registrasi/registrasi-ruangan', name: 'Registrasi Pasien', element: RegistrasiRuangan },
  { path: '/registrasi', name: 'Daftar Registrasi Pasien', element: Registrasi },
]

export default routes