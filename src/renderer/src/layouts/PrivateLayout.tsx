// layouts/PrivateLayout.jsx
import { Outlet } from 'react-router-dom'
import FooterBar from './FooterBar'

export default function PrivateLayout() {
  return (
    <div style={{ paddingBottom: '50px' }}>
      <Outlet />
      <FooterBar />
    </div>
  )
}
