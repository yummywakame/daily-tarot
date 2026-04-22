/** Prefix for files under client/public (e.g. /decks/...) when app uses a Vite base path. */
export function publicUrl(pathFromPublicRoot) {
  const base = import.meta.env.BASE_URL || '/'
  const p = pathFromPublicRoot.startsWith('/') ? pathFromPublicRoot.slice(1) : pathFromPublicRoot
  return `${base}${p}`
}
