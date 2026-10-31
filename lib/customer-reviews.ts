export type CustomerReview = {
  id: string
  authorName: string
  avatarUrl: string | null
  text: string
  language: "fr" | "ar" | "en"
  ownerResponse?: { text: string; language: "en" }
}

/**
 * Google review text and avatar URLs supplied verbatim by the agency on
 * 31 October 2026. This is an agency-provided selection, not a live Google feed.
 * Ratings, dates, profile URLs and individual review URLs were not supplied
 * or independently verified and are intentionally absent.
 */
export const customerReviews: readonly CustomerReview[] = [
  {
    id: "ayoub-bhalli",
    authorName: "Ayoub Bhalli",
    avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocKrJiwx6L9f-mFFe8CMlxH7INn6oF3zaonCPqsyEW_xark6aH9j=w36-h36-p-rp-mo-br100",
    text: "Excellente expérience avec AB FAST CAR à Marrakech ! Service professionnel, équipe accueillante et réactive. Réservation simple, communication claire et très bon accompagnement. Je recommande vivement AB FAST CAR pour la location de voitures à Marrakech ! 🚗✨",
    language: "fr",
  },
  {
    id: "driss-rachdi",
    authorName: "Driss Rachdi",
    avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocJ3wvGKuGFOYmqk7Ap5uZYQ32yLC_LnzbrD5Hy-TQz7J2bZu38=w36-h36-p-rp-mo-br100",
    text: "أحسن اجونس",
    language: "ar",
  },
  {
    id: "meryama-belomari",
    authorName: "Meryama Belomari",
    avatarUrl: "https://lh3.googleusercontent.com/a-/ALV-UjV6LHM-eDnC1_kr0lXTK1UwwGioOZc4INR5TQbqV1_ZHZEpp1_C=w36-h36-p-rp-mo-br100",
    text: "Meilleure agence",
    language: "fr",
  },
  {
    id: "hamza-boughazi",
    authorName: "Hamza Boughazi",
    avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocJPjFYWftp0X9wj4zJ3nhzKSQA3barSFWdt84X50uA4FechEQ=w36-h36-p-rp-mo-br100",
    text: "Great service",
    language: "en",
    ownerResponse: { text: "Thank you", language: "en" },
  },
]
