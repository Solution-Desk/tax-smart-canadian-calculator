import { Category, Province } from "./taxData"
import { validateCategory } from "./taxCalculator"

export type ShareableLineItem = {
  label: string
  category: Category
  amount: string
}

export type ShareableState = {
  province: Province
  items: ShareableLineItem[]
}

const HASH_KEY = 'state'

function encodePayload(payload: string) {
  if (typeof btoa === 'function') {
    return btoa(payload)
  }
  return payload
}

function decodePayload(raw: string) {
  if (typeof atob === 'function') {
    return atob(raw)
  }
  return raw
}

export function encodeState(state: ShareableState): string {
  const payload = JSON.stringify(state)
  const encoded = encodeURIComponent(encodePayload(payload))
  return `${HASH_KEY}=${encoded}`
}

export function decodeState(fragment: string): ShareableState | null {
  if (!fragment.startsWith(`${HASH_KEY}=`)) return null
  const raw = fragment.slice(HASH_KEY.length + 1)
  try {
    const decoded = decodePayload(decodeURIComponent(raw))
    const parsed = JSON.parse(decoded)
    if (!parsed || typeof parsed !== 'object') return null

    const province = parsed.province as Province | undefined
    const itemsInput = Array.isArray(parsed.items) ? parsed.items : []

    if (!province) return null

    const items: ShareableLineItem[] = itemsInput.map((entry: any, index: number) => ({
      label:
        typeof entry?.label === 'string' && entry.label.trim() ? entry.label : `Item ${index + 1}`,
      category: validateCategory(entry?.category),
      amount:
        typeof entry?.amount === 'string' || typeof entry?.amount === 'number'
          ? String(entry.amount)
          : '0',
    }))

    return { province, items }
  } catch (error) {
    console.warn('Failed to decode share state', error)
    return null
  }
}

export function extractStateFromHash(hash: string): ShareableState | null {
  if (!hash) return null
  const fragment = hash.replace(/^#/, '')
  const segments = fragment.split('&')
  for (const segment of segments) {
    const result = decodeState(segment)
    if (result) return result
  }
  return null
}
