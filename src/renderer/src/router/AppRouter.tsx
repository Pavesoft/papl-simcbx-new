// router/AppRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import PrivateLayout from '../layouts/PrivateLayout'
import AuthGuard from '../guards/AuthGuard'

// Public Pages
import Login from '../pages/auth/Login'
import NotFound from '../pages/NotFound'

// Private Pages
import CreateModel from '../pages/ModelConfig/Components/CreateModelsSettings/CreateModel'
import ViewModelsSetting from '../pages/ModelConfig/Components/ViewModelsSetting/ViewModelsSetting'
import ManualTest from '../pages/ManualTest/ManualTest'
import AutoMode from '../pages/AutoMode/AutoMode'
import Reports from '../pages/Reports/Reports'
import LoginConfig from '../pages/LoginConfig/LoginConfig'
import ModelConfig from '../pages/ModelConfig/ModelConfig'
import { useGlobalContext } from '../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'

export default function AppRouter() {
  const { userDetails } = useGlobalContext() // Get user details from context

  // Function to check if user has permission for a specific route
  const hasPermission = (permissionKey: string) => {
    if (!userDetails) return false
    return userDetails[permissionKey as keyof typeof userDetails] === true
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <AuthGuard>
            <PrivateLayout />
          </AuthGuard>
        }
      >
        <Route
          path="/auto-mode"
          element={hasPermission('autoMode') ? <AutoMode /> : <NotFound />}
        />
        <Route path="/manual" element={hasPermission('manual') ? <ManualTest /> : <NotFound />} />
        <Route
          path="/login-config"
          element={hasPermission('loginConfig') ? <LoginConfig /> : <NotFound />}
        />
        <Route path="/reports" element={hasPermission('reports') ? <Reports /> : <NotFound />} />
        <Route
          path="/model-config"
          element={hasPermission('modelConfig') ? <ModelConfig /> : <NotFound />}
        />
        <Route
          path="/model-config/create-model"
          element={hasPermission('modelConfig') ? <CreateModel /> : <NotFound />}
        />
        <Route
          path="/model-config/:key/:id"
          element={hasPermission('modelConfig') ? <ViewModelsSetting /> : <NotFound />}
        />
      </Route>

      {/* Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
