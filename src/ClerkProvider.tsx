import { ClerkProvider as ClerkProviderBase } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  
  return (
    <ClerkProviderBase
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      {children}
    </ClerkProviderBase>
  )
}
