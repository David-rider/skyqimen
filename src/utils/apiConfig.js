// API configuration for skyqimen
// Defaults to empty string (relative URL) in production, allowing Cloudflare Pages Functions routing.
// Can be overridden locally via environment variables.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
