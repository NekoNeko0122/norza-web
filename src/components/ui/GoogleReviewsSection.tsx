import { ExternalLink, Star } from "lucide-react";
import { getPlaceReviews } from "@/lib/googlePlaces";

export default async function GoogleReviewsSection({
  placeId,
  fallbackMapsUrl,
}: {
  placeId?: string;
  fallbackMapsUrl?: string;
}) {
  if (!placeId) return null;

  const data = await getPlaceReviews(placeId);
  if (!data) return null;

  const mapsUrl = data.googleMapsUri ?? fallbackMapsUrl;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Reviews from Google Maps</h2>
          <p className="mt-1 text-xs text-ink-faint">
            Sourced live from Google Maps, not written for this site.
          </p>
        </div>
        {data.rating != null && (
          <span className="flex items-center gap-1.5 text-sm">
            <Star size={16} className="fill-gold-500 text-gold-500" />
            <span className="font-semibold text-ink">{data.rating}</span>
            {data.userRatingCount != null && (
              <span className="text-ink-faint">({data.userRatingCount} on Google)</span>
            )}
          </span>
        )}
      </div>

      {data.reviews.length > 0 ? (
        <div className="mt-5 space-y-4">
          {data.reviews.map((r, i) => (
            <div key={i} className="rounded-2xl border border-edge bg-surface p-5">
              <div className="flex items-center gap-3">
                {r.authorPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external Google-hosted avatar
                  <img src={r.authorPhotoUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tint text-xs font-semibold text-brand-600">
                    {r.authorName.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{r.authorName}</p>
                  <div className="flex items-center gap-1.5 text-xs text-ink-faint">
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          size={11}
                          className={j < r.rating ? "fill-gold-500 text-gold-500" : "fill-none text-brand-200"}
                        />
                      ))}
                    </span>
                    {r.relativeTime && <span>· {r.relativeTime}</span>}
                  </div>
                </div>
              </div>
              {r.text && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{r.text}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-brand-200 bg-tint/50 p-6 text-center text-sm text-ink-faint">
          No Google reviews available for this place yet.
        </p>
      )}

      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          See all reviews on Google Maps <ExternalLink size={13} />
        </a>
      )}
    </section>
  );
}
