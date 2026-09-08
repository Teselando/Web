import { PlatformMark } from "@/components/platform-mark";
import { externalResources } from "@/lib/content";
import { getTrustpilotProof } from "@/lib/trustpilot";

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
}

export async function TrustpilotProof() {
  const proof = await getTrustpilotProof();
  const sourceLabel = proof.source === "live"
    ? "Actualizado mediante la API oficial de Trustpilot"
    : `Comprobado en el perfil público · ${formatDate(proof.verifiedAt)}`;

  return <div className="trust-proof" data-trust-source={proof.source}>
    <div className="trust-score-panel">
      <div className="trust-brand"><PlatformMark name="trustpilot" /><span>Trustpilot</span></div>
      <p className="trust-score" aria-label={`TrustScore ${proof.trustScore.toLocaleString("es-ES")} sobre 5`}>
        <strong>{proof.trustScore.toLocaleString("es-ES")}</strong><span>/ 5</span>
      </p>
      <p className="trust-count">{proof.reviewCount.toLocaleString("es-ES")} opiniones</p>
      <p className="trust-source">{sourceLabel}</p>
      <a className="trust-link text-link" href={externalResources.trustpilot} target="_blank" rel="noopener noreferrer" aria-label="Ver todas las opiniones de Teselando en Trustpilot">
        Ver perfil completo <span aria-hidden="true">↗</span>
      </a>
    </div>

    <ol className="trust-reviews" aria-label="Opiniones reales publicadas en Trustpilot">
      {proof.reviews.map((review) => <li key={review.id} className="trust-review">
        <article>
          <div className="trust-review-meta">
            <span className="trust-review-stars"><span aria-hidden="true">{"★".repeat(review.stars)}</span><span className="sr-only">{review.stars} de 5 estrellas</span></span>
            <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
          </div>
          <h3>{review.title}</h3>
          <blockquote><p>“{review.text}”</p></blockquote>
          <p className="trust-reviewer">{review.reviewer}</p>
        </article>
      </li>)}
    </ol>
  </div>;
}
