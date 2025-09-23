import { useLocalStorage } from './useAutoCalc'

export function useConsent() {
  const [consented, setConsented] = useLocalStorage<boolean>('taxapp:consent', false)
  return {
    consented,
    accept: () => setConsented(true),
    revoke: () => setConsented(false),
  }
}
