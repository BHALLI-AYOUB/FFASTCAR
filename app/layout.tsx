import type React from "react"

// The <html> element is rendered by app/[locale]/layout.tsx, which knows the
// language and text direction of the page.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
