// guards/AuthGuard.tsx
import { Navigate } from 'react-router-dom'

import type { ReactNode } from 'react'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = !!sessionStorage.getItem('user')

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
