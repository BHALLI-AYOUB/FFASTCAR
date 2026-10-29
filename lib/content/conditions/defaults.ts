import type { Locale } from "@/i18n/config"
import type { RentalConditions } from "@/lib/content/types"
import fr from "./fr.json"
import en from "./en.json"
import nl from "./nl.json"
import ar from "./ar.json"

/** New fields are added to older saved documents without replacing existing edits. */
export function defaultConditions(): Record<Locale, RentalConditions> {
  return structuredClone({ fr, en, nl, ar })
}
