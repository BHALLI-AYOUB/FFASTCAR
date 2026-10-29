import { notFound } from "next/navigation"

// Any path that matches no page renders app/[locale]/not-found.tsx with a
// real 404 status instead of a soft 200.
export default function CatchAll() {
  notFound()
}
