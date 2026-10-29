/** Shared section title: small eyebrow, white heading, grey subtitle. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  as: Heading = "h2",
  id,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  as?: "h1" | "h2"
  id?: string
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
      {eyebrow && <p className="mb-3 text-xs font-bold tracking-[0.22em] text-zinc-400 uppercase">{eyebrow}</p>}
      <Heading id={id} className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </Heading>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">{subtitle}</p>}
    </div>
  )
}
