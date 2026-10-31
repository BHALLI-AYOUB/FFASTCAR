import { useTranslations } from "next-intl"
import { ArrowUpRight } from "lucide-react"
import { GoogleReviews } from "@/components/google-reviews"
import { customerReviews } from "@/lib/customer-reviews"
import { GOOGLE_BUSINESS_URL } from "@/lib/google-reviews"
import styles from "@/components/google-reviews.module.css"

export function GoogleReviewsSection() {
  const t = useTranslations("reviews")
  return (
    <section id="reviews" aria-labelledby="reviews-title" className={styles.section}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className={styles.header}>
          <div className={styles.heading}>
            <p className={styles.eyebrow}>{t("eyebrow")}</p>
            <h2 id="reviews-title" className={`font-display ${styles.title}`}>{t("title")}</h2>
            <p className={styles.subtitle}>{t("subtitle")}</p>
          </div>
          <div className={styles.googleLink}>
            {/* Official, unmodified Google Maps attribution asset. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.darkLogo} src="/images/google-maps-attribution-white.svg" alt="Google Maps" width={98} height={18} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.lightLogo} src="/images/google-maps-attribution.svg" alt="Google Maps" width={98} height={18} />
            <a href={GOOGLE_BUSINESS_URL} target="_blank" rel="noopener noreferrer">
              {t("allReviews")}<ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </div>
        </header>
        <GoogleReviews reviews={customerReviews} labels={{
          previous: t("previous"), next: t("next"), carousel: t("carousel"),
          ownerResponse: t("ownerResponse"), source: t("source"),
          position: t.raw("position") as string,
        }} />
      </div>
    </section>
  )
}
