export const env = {
  apiUrl:
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? "http://localhost:8787" : window.location.origin),
} as const
