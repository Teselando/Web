export type TrustpilotReview = {
  id: string;
  stars: number;
  title: string;
  text: string;
  reviewer: string;
  createdAt: string;
};

export type TrustpilotProof = {
  trustScore: number;
  reviewCount: number;
  reviews: TrustpilotReview[];
  source: "live" | "verified-snapshot";
  verifiedAt: string;
};

const verifiedSnapshot: TrustpilotProof = {
  trustScore: 4.2,
  reviewCount: 6,
  source: "verified-snapshot",
  verifiedAt: "2026-09-04",
  reviews: [
    {
      id: "lucia-garcia-jimenez-2026-02-04",
      stars: 5,
      title: "Excelente experiencia",
      text: "Los profesores son muy dedicados y buenos en su trabajo, me ha ayudado a mejorar grandemente.",
      reviewer: "lucia garcia jimenez",
      createdAt: "2026-02-04",
    },
    {
      id: "laura-fernandez-sanchez-2026-02-03",
      stars: 5,
      title: "Muy buen servicio",
      text: "Muy buen servicio, puntualidad y buena atención",
      reviewer: "Laura Fernández Sánchez",
      createdAt: "2026-02-03",
    },
    {
      id: "susana-2025-11-17",
      stars: 5,
      title: "Clase de FYQ",
      text: "Mi hijo recibe clases de física y química de 4°ESO y no solo ha conseguido remontar el primer trimestre sino q está sacando buenas notas en los exámenes del segundo. Son muy apañados y siempre están dispuestos a ayudarlo con cualquier duda y en cualquier momento q lo necesite. Muy recomendable.",
      reviewer: "Susana",
      createdAt: "2025-11-17",
    },
  ],
};

type BusinessUnitResponse = {
  id?: unknown;
  score?: { trustScore?: unknown };
  numberOfReviews?: { total?: unknown } | unknown;
};

type ReviewsResponse = {
  reviews?: Array<{
    id?: unknown;
    stars?: unknown;
    title?: unknown;
    text?: unknown;
    createdAt?: unknown;
    consumer?: { displayName?: unknown };
  }>;
};

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

async function trustpilotFetch<T>(url: string, apiKey: string): Promise<T> {
  const response = await fetch(url, {
    headers: { apikey: apiKey },
    next: { revalidate: 86_400 },
  });

  if (!response.ok) throw new Error(`Trustpilot API returned ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getTrustpilotProof(): Promise<TrustpilotProof> {
  const apiKey = process.env.TRUSTPILOT_API_KEY;
  let businessUnitId = process.env.TRUSTPILOT_BUSINESS_UNIT_ID;
  if (!apiKey) return verifiedSnapshot;

  try {
    if (!businessUnitId) {
      const business = await trustpilotFetch<BusinessUnitResponse>(
        "https://api.trustpilot.com/v1/business-units/find?name=teselando.es",
        apiKey,
      );
      businessUnitId = stringValue(business.id);
    }

    if (!businessUnitId) return verifiedSnapshot;

    const encodedId = encodeURIComponent(businessUnitId);
    const [business, reviewData] = await Promise.all([
      trustpilotFetch<BusinessUnitResponse>(`https://api.trustpilot.com/v1/business-units/${encodedId}`, apiKey),
      trustpilotFetch<ReviewsResponse>(`https://api.trustpilot.com/v1/business-units/${encodedId}/reviews?page=1&perPage=3`, apiKey),
    ]);
    const total = typeof business.numberOfReviews === "object" && business.numberOfReviews
      ? numberValue((business.numberOfReviews as { total?: unknown }).total)
      : numberValue(business.numberOfReviews);
    const reviews = (reviewData.reviews ?? []).map((review, index) => ({
      id: stringValue(review.id) || `trustpilot-review-${index}`,
      stars: numberValue(review.stars),
      title: stringValue(review.title),
      text: stringValue(review.text),
      reviewer: stringValue(review.consumer?.displayName),
      createdAt: stringValue(review.createdAt),
    })).filter((review) => review.title && review.text && review.reviewer && review.createdAt && review.stars);
    const trustScore = numberValue(business.score?.trustScore);

    if (!trustScore || !total || reviews.length === 0) return verifiedSnapshot;
    return {
      trustScore,
      reviewCount: total,
      reviews,
      source: "live",
      verifiedAt: new Date().toISOString().slice(0, 10),
    };
  } catch {
    return verifiedSnapshot;
  }
}
