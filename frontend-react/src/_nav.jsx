
import React from 'react'
import CIcon from '@coreui/icons-react'

import {
  cilBug,
  cilCalculator,
  cilChartPie,
  cilDescription,
  cilPuzzle,
  cilSpeedometer,
  cilNotes,
  cilClipboard
} from '@coreui/icons'

import {
  CNavGroup,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

// Icon mapping
const iconMap = {
  cilBug,
  cilCalculator,
  cilChartPie,
  cilDescription,
  cilPuzzle,
  cilSpeedometer,
  cilNotes,
  cilClipboard
}

const renderIcon = (icon) => {
  if (!icon || !iconMap[icon]) return null

  return (
    <CIcon
      icon={iconMap[icon]}
      customClassName="nav-icon"
    />
  )
}

// ==========================================
// MASTER MENU
// ==========================================

const masterMenu = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: renderIcon('cilSpeedometer'),
  },
  {
    component: CNavGroup,
    name: 'Master Data',
    icon: renderIcon('cilPuzzle'),
    items: [
      {
        component: CNavItem,
        name: 'Pengguna',
        to: '/master/user',
      },
      {
        component: CNavItem,
        name: 'Pegawai',
        to: '/master/pegawai',
      },
      {
        component: CNavItem,
        name: 'Dokter',
        to: '/master/dokter',
      },
      {
        component: CNavItem,
        name: 'Ruangan',
        to: '/master/ruangan',
      },
      {
        component: CNavItem,
        name: 'Jadwal Dokter',
        to: '/master/jadwal-dokter',
      },
      {
        component: CNavItem,
        name: 'Tindakan Medis',
        to: '/master/tindakan',
      },
      {
        component: CNavItem,
        name: 'Obat',
        to: '/master/obat',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Pendaftaran',
    icon: renderIcon('cilClipboard'),
    items: [
      {
        component: CNavItem,
        name: 'Daftar Pasien',
        to: '/registrasi/pasien',
      },
      {
        component: CNavItem,
        name: 'Daftar Registrasi',
        to: '/registrasi',
      },
    ]
  }
]

// ==========================================
// MENU BERDASARKAN ROLE
// ==========================================

const roleMenus = {
  ADMIN: [
    ...masterMenu,
  ],

  DOCTOR: [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: renderIcon('cilSpeedometer'),
    },
  ],

  PHARMACY: [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: renderIcon('cilSpeedometer'),
    },
  ],

  REGISTRATION: [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: renderIcon('cilSpeedometer'),
    },
    {
      component: CNavGroup,
      name: 'Pendaftaran',
      icon: renderIcon('cilClipboard'),
      items: [
        {
          component: CNavItem,
          name: 'Daftar Pasien',
          to: '/registrasi/pasien',
        },
        {
          component: CNavItem,
          name: 'Daftar Registrasi',
          to: '/registrasi',
        },
      ]
    }
  ],

  LABORATORY: [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: renderIcon('cilSpeedometer'),
    },
  ],

  CASHIER: [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: renderIcon('cilSpeedometer'),
    },
  ],
}

// ==========================================
// IDENTIFIKASI USER
// ==========================================

const getUserRoles = () => {
  try {
    const authUser = localStorage.getItem('auth_user')

    if (!authUser) return []

    const user = JSON.parse(authUser)

    return (user.roles || []).map(
      (role) => role.role_code
    )
  } catch (error) {
    console.error('Gagal membaca auth_user:', error)
    return []
  }
}

// ==========================================
// GENERATE NAVIGATION
// ==========================================

const getNavigation = () => {
  const roles = getUserRoles()

  
  const menus = roles.flatMap(
    (role) => roleMenus[role] || []
  )

  const uniqueMenus = menus.filter(
    (menu, index, self) =>
      index === self.findIndex(
        (item) =>
          item.name === menu.name &&
          item.to === menu.to
      )
  )

  return uniqueMenus
}

const _nav = getNavigation()

export default _nav
