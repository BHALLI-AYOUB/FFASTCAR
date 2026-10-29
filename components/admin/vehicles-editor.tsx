"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ExternalLink, EyeOff, Plus, Star, Trash2, TriangleAlert, X } from "lucide-react"

import { LOCALE_META, locales, type Locale } from "@/i18n/config"
import type { ImageAsset, LocalizedList, VehicleRecord } from "@/lib/content/types"
import {
  Card,
  LocaleTag,
  LocalizedField,
  NumberField,
  TextField,
  Toggle,
  buttonClass,
  inputClass,
  moveItem,
  useHasIssueUnder,
  useIssue,
} from "@/components/admin/fields"
import { PhotoThumb, PhotoUploadButton } from "@/components/admin/photo-upload"

const MAX_GALLERY = 12
const MAX_FEATURES = 8

/** "Mercedes Classe A 2024" → "mercedes-classe-a-2024" (same rule as the server's SLUG_PATTERN). */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

const emptyText = () => Object.fromEntries(locales.map((l) => [l, ""])) as Record<Locale, string>

function newVehicle(): VehicleRecord {
  return {
    slug: "",
    name: "",
    brand: "",
    year: new Date().getFullYear(),
    priceMad: 0,
    hidden: false,
    featured: false,
    image: { src: "", width: 0, height: 0 },
    gallery: [],
    category: emptyText(),
    features: Object.fromEntries(locales.map((l) => [l, [] as string[]])) as LocalizedList,
  }
}

export function VehiclesEditor({
  vehicles,
  savedSlugs,
  onChange,
}: {
  vehicles: VehicleRecord[]
  /** Slugs already published: their URL must never change. */
  savedSlugs: Set<string>
  onChange: (vehicles: VehicleRecord[]) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const current = selected !== null ? vehicles[selected] : undefined

  const update = (i: number, patch: Partial<VehicleRecord>) => onChange(vehicles.map((v, j) => (j === i ? { ...v, ...patch } : v)))

  function add() {
    onChange([...vehicles, newVehicle()])
    setSelected(vehicles.length)
  }

  function remove(i: number) {
    const v = vehicles[i]
    const message = savedSlugs.has(v.slug)
      ? `Supprimer « ${v.name} » ? Sa page /fleet/${v.slug} renverra une erreur 404.\n\nPour le retirer temporairement, décochez plutôt « Visible sur le site ».`
      : `Supprimer ce nouveau véhicule ?`
    if (!window.confirm(message)) return
    onChange(vehicles.filter((_, j) => j !== i))
    setSelected(null)
  }

  function move(i: number, step: -1 | 1) {
    onChange(moveItem(vehicles, i, step))
    if (selected === i) setSelected(i + step)
    else if (selected === i + step) setSelected(i)
  }

  const visibleCount = vehicles.filter((v) => !v.hidden).length

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <div className={current ? "hidden lg:block" : ""}>
        <Card
          title="Véhicules"
          description={`${visibleCount} visibles sur ${vehicles.length}. L'ordre de la liste est celui du site.`}
          actions={
            <button type="button" onClick={add} className={buttonClass.primary}>
              <Plus className="size-4" aria-hidden /> Ajouter
            </button>
          }
        >
          <ol className="-mx-2 space-y-1">
            {vehicles.map((v, i) => (
              <VehicleRow
                key={i}
                index={i}
                vehicle={v}
                active={selected === i}
                isFirst={i === 0}
                isLast={i === vehicles.length - 1}
                onSelect={() => setSelected(i)}
                onMove={(step) => move(i, step)}
              />
            ))}
          </ol>
        </Card>
      </div>

      {current && selected !== null ? (
        <VehicleForm
          key={selected}
          index={selected}
          vehicle={current}
          slugLocked={savedSlugs.has(current.slug)}
          onBack={() => setSelected(null)}
          onChange={(patch) => update(selected, patch)}
          onDelete={() => remove(selected)}
        />
      ) : (
        <div className="hidden items-center justify-center rounded-2xl border border-dashed border-white/10 p-10 text-sm text-zinc-500 lg:flex">
          Choisissez un véhicule dans la liste pour le modifier.
        </div>
      )}
    </div>
  )
}

function VehicleRow({
  index,
  vehicle,
  active,
  isFirst,
  isLast,
  onSelect,
  onMove,
}: {
  index: number
  vehicle: VehicleRecord
  active: boolean
  isFirst: boolean
  isLast: boolean
  onSelect: () => void
  onMove: (step: -1 | 1) => void
}) {
  const hasError = useHasIssueUnder(`vehicles.${index}`)
  return (
    <li className={`flex items-center gap-2 rounded-xl p-2 ${active ? "bg-white/10" : "hover:bg-white/5"}`}>
      <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg">
        <PhotoThumb image={vehicle.image} alt="" className="h-12 w-16 shrink-0 rounded-md" />
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 truncate text-sm font-medium text-white">
            {hasError && <TriangleAlert className="size-3.5 shrink-0 text-red-400" aria-label="Erreur" />}
            <span className="truncate">{vehicle.name || "Nouveau véhicule"}</span>
          </span>
          <span className="flex items-center gap-2 text-xs text-zinc-400">
            {vehicle.priceMad > 0 ? `${vehicle.priceMad} MAD/jour` : "Prix à définir"}
            {vehicle.hidden && (
              <span className="inline-flex items-center gap-1 text-amber-400">
                <EyeOff className="size-3" aria-hidden /> Masqué
              </span>
            )}
          </span>
        </span>
      </button>
      <div className="flex shrink-0 flex-col gap-1">
        <button type="button" className={`${buttonClass.icon} size-7`} disabled={isFirst} onClick={() => onMove(-1)} aria-label={`Monter ${vehicle.name}`}>
          <ArrowUp className="size-3.5" aria-hidden />
        </button>
        <button type="button" className={`${buttonClass.icon} size-7`} disabled={isLast} onClick={() => onMove(1)} aria-label={`Descendre ${vehicle.name}`}>
          <ArrowDown className="size-3.5" aria-hidden />
        </button>
      </div>
    </li>
  )
}

function VehicleForm({
  index,
  vehicle,
  slugLocked,
  onBack,
  onChange,
  onDelete,
}: {
  index: number
  vehicle: VehicleRecord
  slugLocked: boolean
  onBack: () => void
  onChange: (patch: Partial<VehicleRecord>) => void
  onDelete: () => void
}) {
  const p = `vehicles.${index}`
  const srcError = useIssue(`${p}.image.src`)
  const imageError = useIssue(`${p}.image`) ?? srcError

  function setName(name: string) {
    // A new vehicle's identifier follows its name until it is edited by hand.
    const followsName = !slugLocked && (vehicle.slug === "" || vehicle.slug === slugify(vehicle.name))
    onChange(followsName ? { name, slug: slugify(name) } : { name })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className={`${buttonClass.secondary} lg:hidden`}>
          <ArrowLeft className="size-4" aria-hidden /> Liste
        </button>
        <h2 className="text-xl font-bold text-white">{vehicle.name || "Nouveau véhicule"}</h2>
        {slugLocked && !vehicle.hidden && (
          <a href={`/fleet/${vehicle.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
            Voir la page <ExternalLink className="size-3.5" aria-hidden />
          </a>
        )}
      </div>

      <Card title="Photo principale" description="Affichée sur la carte du véhicule et en haut de sa page. Format paysage conseillé.">
        <div className="flex flex-wrap items-end gap-4">
          <PhotoThumb image={vehicle.image} alt={vehicle.name} className="aspect-[4/3] w-56 rounded-xl border border-white/10" />
          <PhotoUploadButton label={vehicle.image.src ? "Remplacer la photo" : "Ajouter une photo"} onUploaded={([image]) => onChange({ image })} />
        </div>
        {imageError && <p className="text-xs font-medium text-red-400">Photo obligatoire.</p>}
      </Card>

      <Card title="Informations">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Nom" value={vehicle.name} onChange={setName} path={`${p}.name`} placeholder="Mercedes Classe A" />
          <TextField label="Marque" value={vehicle.brand} onChange={(brand) => onChange({ brand })} path={`${p}.brand`} placeholder="Mercedes" />
          <NumberField label="Année" integer value={vehicle.year} onChange={(year) => onChange({ year })} path={`${p}.year`} />
          <NumberField
            label="Prix par jour"
            integer
            suffix="MAD"
            value={vehicle.priceMad}
            onChange={(priceMad) => onChange({ priceMad })}
            path={`${p}.priceMad`}
            hint="Prix de référence en dirhams. Les autres devises sont calculées automatiquement."
          />
        </div>
        <TextField
          label="Identifiant dans l'adresse"
          value={vehicle.slug}
          onChange={(slug) => onChange({ slug: slug.toLowerCase() })}
          path={`${p}.slug`}
          readOnly={slugLocked}
          hint={
            slugLocked
              ? `Adresse : /fleet/${vehicle.slug} — elle ne change pas, pour ne pas casser les liens et le référencement.`
              : "Rempli à partir du nom. Lettres minuscules, chiffres et tirets. Il ne pourra plus être modifié après l'enregistrement."
          }
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            label="Visible sur le site"
            hint="Décoché : le véhicule disparaît du site et sa page renvoie une erreur 404."
            checked={!vehicle.hidden}
            onChange={(visible) => onChange({ hidden: !visible })}
          />
        </div>
      </Card>

      <Card title="Catégorie et équipements" description="Dans chaque langue du site.">
        <LocalizedField label="Catégorie" value={vehicle.category} onChange={(category) => onChange({ category })} path={`${p}.category`} hint="Ex. : SUV de luxe, Citadine, Berline." />
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-zinc-200">Équipements</legend>
          <p className="text-xs text-zinc-500">Un par ligne, {MAX_FEATURES} au maximum, 60 caractères chacun. Ex. : Automatique, 5 places, Climatisation.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {locales.map((l) => (
              <FeatureList
                key={l}
                locale={l}
                value={vehicle.features[l]}
                path={`${p}.features.${l}`}
                onChange={(list) => onChange({ features: { ...vehicle.features, [l]: list } })}
              />
            ))}
          </div>
          {vehicle.features.fr.length > 0 && locales.some((l) => vehicle.features[l].length === 0) && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  features: Object.fromEntries(locales.map((l) => [l, vehicle.features[l].length ? vehicle.features[l] : vehicle.features.fr])) as LocalizedList,
                })
              }
              className="text-xs text-zinc-400 underline underline-offset-2 hover:text-white"
            >
              Copier le français dans les langues vides
            </button>
          )}
        </fieldset>
      </Card>

      <Gallery vehicle={vehicle} onChange={onChange} />

      <div className="flex justify-end border-t border-white/10 pt-6">
        <button type="button" onClick={onDelete} className={buttonClass.danger}>
          <Trash2 className="size-4" aria-hidden /> Supprimer ce véhicule
        </button>
      </div>
    </div>
  )
}

const parseLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

/** Text area with one item per line; keeps the raw text so empty lines can be typed. */
function FeatureList({ locale, value, path, onChange }: { locale: Locale; value: string[]; path: string; onChange: (list: string[]) => void }) {
  const [text, setText] = useState(value.join("\n"))
  const hasError = useHasIssueUnder(path)

  useEffect(() => {
    if (parseLines(text).join("\n") !== value.join("\n")) setText(value.join("\n"))
  }, [value]) // only on outside changes, not on each keystroke

  const tooMany = parseLines(text).length > MAX_FEATURES
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <LocaleTag locale={locale} /> {LOCALE_META[locale].label}
      </div>
      <textarea
        aria-label={`Équipements (${LOCALE_META[locale].label})`}
        value={text}
        rows={5}
        dir={LOCALE_META[locale].dir}
        aria-invalid={hasError || tooMany}
        onChange={(e) => {
          setText(e.target.value)
          onChange(parseLines(e.target.value))
        }}
        className={`${inputClass} resize-y`}
      />
      {(hasError || tooMany) && <p className="text-xs font-medium text-red-400">{MAX_FEATURES} équipements maximum, 60 caractères chacun.</p>}
    </div>
  )
}

function Gallery({ vehicle, onChange }: { vehicle: VehicleRecord; onChange: (patch: Partial<VehicleRecord>) => void }) {
  const gallery = vehicle.gallery
  const setGallery = (next: ImageAsset[]) => onChange({ gallery: next })

  /** Swap a gallery photo with the main photo. */
  function makeMain(i: number) {
    const rest = gallery.filter((_, j) => j !== i)
    onChange({ image: gallery[i], gallery: vehicle.image.src ? [vehicle.image, ...rest] : rest })
  }
  return (
    <Card
      title="Galerie"
      description={`Photos supplémentaires affichées sur la page du véhicule (${gallery.length}/${MAX_GALLERY}).`}
      actions={<PhotoUploadButton label="Ajouter des photos" multiple max={MAX_GALLERY - gallery.length} onUploaded={(images) => setGallery([...gallery, ...images])} />}
    >
      {gallery.length === 0 ? (
        <p className="text-sm text-zinc-500">Aucune photo supplémentaire.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {gallery.map((photo, i) => (
            <li key={photo.src} className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
              <PhotoThumb image={photo} alt={`Photo ${i + 2}`} className="aspect-[4/3] w-full" />
              <div className="flex items-center justify-between gap-1 p-1.5">
                <div className="flex gap-1">
                  <button type="button" className={buttonClass.icon} disabled={i === 0} onClick={() => setGallery(moveItem(gallery, i, -1))} aria-label="Déplacer avant">
                    <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
                  </button>
                  <button type="button" className={buttonClass.icon} disabled={i === gallery.length - 1} onClick={() => setGallery(moveItem(gallery, i, 1))} aria-label="Déplacer après">
                    <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                  </button>
                </div>
                <div className="flex gap-1">
                  <button type="button" className={buttonClass.icon} onClick={() => makeMain(i)} aria-label={`Utiliser la photo ${i + 2} comme photo principale`} title="Photo principale">
                    <Star className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={buttonClass.icon}
                    onClick={() => setGallery(gallery.filter((_, j) => j !== i))}
                    aria-label={`Retirer la photo ${i + 2}`}
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
