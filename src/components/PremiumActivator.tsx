import { ReactNode, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePremium } from '../hooks/usePremium'

type PremiumActivatorProps = {
  children: ReactNode;
};

export function PremiumActivator({ children }: PremiumActivatorProps) {
  const { enable } = usePremium()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const premium = params.get('premium')
    if (premium === '1' || premium === 'true') {
      enable()
      params.delete('premium')
      const nextSearch = params.toString()
      navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '', hash: location.hash }, { replace: true })
    }
  }, [location, navigate, enable])

  return <>{children}</>
}
