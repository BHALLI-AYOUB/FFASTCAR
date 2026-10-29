/**
 * Dark (default) / light theme of the public site. Plain module so that both
 * the server layout (inline script) and the client switch read the same key:
 * a constant imported from a "use client" file is only a reference on the
 * server, not its value.
 */
export const THEME_STORAGE_KEY = "abfc-theme"
