import {} from 'remeda'

/**
 * This function is helpful in converting enums from backend to better formatted strings like
 *
 * PENDING_WITH_STATE -> Pending With State
 */
export function formatEnum(value?: string) {
  return value?.split('_').map(capitalize).join(' ') ?? ''
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}
