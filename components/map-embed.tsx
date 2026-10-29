import { Navigation } from "lucide-react"

/**
 * Google Maps, shown without a click (Ayoub's choice). loading="lazy" keeps
 * the embed — heavier than the rest of the page, with third-party cookies —
 * out of the initial load: the browser fetches it only when the contact
 * section comes near the screen.
 *
 * The directions button opens Google Maps with a route to the agency from
 * the visitor's position. It sits at the top: Google's own controls and
 * attribution occupy the bottom of the embed and must stay visible.
 */
export function MapEmbed({
  src,
  title,
  directionsUrl,
  directionsLabel,
}: {
  src: string
  title: string
  directionsUrl: string
  directionsLabel: string
}) {
  return (
    <div className="relative h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 sm:h-[420px]">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        className="h-full w-full border-0"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 start-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-black shadow-lg shadow-black/40 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <Navigation aria-hidden="true" className="h-4 w-4" />
        {directionsLabel}
      </a>
    </div>
  )
}
