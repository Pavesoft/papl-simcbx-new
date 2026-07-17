import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useGlobalContext } from './shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'

export const RouteListener = () => {
  const location = useLocation()
  const { writeMultipleValuesToPlc } = useGlobalContext()
  useEffect(() => {
    const path = location.pathname

    if (path === '/auto-mode') {
      writeMultipleValuesToPlc([
        { address: 'M37', value: true },
        { address: 'M1', value: false }
      ])
    } else if (path === '/manual') {
      writeMultipleValuesToPlc([
        { address: 'M37', value: false },
        { address: 'M1', value: true }
      ])
    } else {
      writeMultipleValuesToPlc([
        { address: 'M37', value: false },
        { address: 'M1', value: false }
      ])
    }
  }, [location.pathname])

  return null
}
