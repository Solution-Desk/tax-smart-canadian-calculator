import { useLocalStorage } from './useAutoCalc'

export function usePremium() {
  const [isPremium, setIsPremium] = useLocalStorage<boolean>('taxapp:premium', false)

  const enable = () => setIsPremium(true)
  const disable = () => setIsPremium(false)
  const toggle = () => setIsPremium(!isPremium)

  return { isPremium, enable, disable, toggle }
}
