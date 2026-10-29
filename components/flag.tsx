import { useId } from "react"

export type FlagCode = "ma" | "fr" | "be" | "gb" | "nl"

/**
 * Small SVG flags for the language / country picker. Emoji flags are not
 * drawn by Windows (it shows the letters "MA", "FR"…), so they are drawn
 * here. Decorative: the country or language name always sits next to them.
 */
export function Flag({ code, className = "h-4 w-6" }: { code: FlagCode; className?: string }) {
  const id = useId()
  return (
    <span aria-hidden="true" className={`inline-block shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/20 ${className}`}>
      <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" className="block h-full w-full">
        {code === "fr" && (
          <>
            <rect width="10" height="20" fill="#0055A4" />
            <rect x="10" width="10" height="20" fill="#fff" />
            <rect x="20" width="10" height="20" fill="#EF4135" />
          </>
        )}
        {code === "be" && (
          <>
            <rect width="10" height="20" fill="#000" />
            <rect x="10" width="10" height="20" fill="#FDDA24" />
            <rect x="20" width="10" height="20" fill="#EF3340" />
          </>
        )}
        {code === "nl" && (
          <>
            <rect width="30" height="6.67" fill="#AE1C28" />
            <rect y="6.67" width="30" height="6.67" fill="#fff" />
            <rect y="13.33" width="30" height="6.67" fill="#21468B" />
          </>
        )}
        {code === "ma" && (
          <>
            <rect width="30" height="20" fill="#C1272D" />
            {/* Green pentagram, centred, radius 4. */}
            <path d="M15 6 L17.35 13.24 L11.2 8.76 H18.8 L12.65 13.24 Z" fill="none" stroke="#006233" strokeWidth="0.7" strokeLinejoin="round" />
          </>
        )}
        {code === "gb" && (
          <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" width="30" height="20">
            <clipPath id={`${id}-s`}>
              <path d="M0 0v30h60V0z" />
            </clipPath>
            <clipPath id={`${id}-t`}>
              <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
            </clipPath>
            <g clipPath={`url(#${id}-s)`}>
              <path d="M0 0v30h60V0z" fill="#012169" />
              <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
              <path d="M0 0l60 30m0-30L0 30" clipPath={`url(#${id}-t)`} stroke="#C8102E" strokeWidth="4" />
              <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
              <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
            </g>
          </svg>
        )}
      </svg>
    </span>
  )
}
