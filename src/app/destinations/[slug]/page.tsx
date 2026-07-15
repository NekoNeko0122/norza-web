import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Ticket,
  Gauge,
  CalendarDays,
  MapPin,
  Navigation,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { destinations, getDestinationBySlug, categoryMeta } from "@/data/destinations";
import DestinationArt from "@/components/ui/DestinationArt";
import RatingStars from "@/components/ui/RatingStars";
import DestinationCard from "@/components/destinations/DestinationCard";
import MiniMap from "@/components/destinations/detail/MiniMapClient";
import { averageRating, googleMapsDirectionsUrl, wazeUrl } from "@/lib/utils";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) return {};
  return {
    title: `${destination.name} | Discover Norzagaray`,
    description: destination.shortDescription,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) notFound();

  const rating = averageRating(destination.reviews);
  const related = destinations
    .filter((d) => d.id !== destination.id && d.category === destination.category)
    .slice(0, 3);

  return (
    <div className="pb-24">
      {/* hero banner, always dark-scrimmed over the art regardless of site theme */}
      <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
        <DestinationArt
          gradient={destination.gradient}
          category={destination.category}
          images={destination.images}
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/85 via-plum-950/20 to-transparent" />

        <div className="absolute inset-x-0 top-0 mx-auto flex max-w-7xl items-center justify-between px-6 pt-6 sm:px-8">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <ArrowLeft size={15} /> Back to Destinations
          </Link>
          {!destination.onGoogleMaps && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
              <Sparkles size={13} /> Community-registered pin
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-8 sm:px-8">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700">
            {categoryMeta[destination.category].label}
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            {destination.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/85">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} /> {destination.address}
            </span>
            {rating > 0 && (
              <span className="flex items-center gap-1.5">
                <RatingStars rating={rating} size={14} />
                <span className="font-semibold">{rating}</span>
                <span className="text-white/60">({destination.reviews?.length} reviews)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Main content */}
        <div className="space-y-10">
          {/* Quick info */}
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-edge bg-surface p-6 shadow-sm sm:grid-cols-4">
            <QuickStat icon={Ticket} label="Entrance Fee" value={destination.entranceFee ?? "Free"} />
            <QuickStat icon={Clock} label="Open Hours" value={destination.openHours ?? "Ask locally"} />
            <QuickStat
              icon={Gauge}
              label="Difficulty"
              value={destination.difficulty ? capitalize(destination.difficulty) : "Easy"}
            />
            <QuickStat
              icon={CalendarDays}
              label="Best Time"
              value={destination.bestTimeToVisit ?? "Year-round"}
            />
          </div>

          <section>
            <h2 className="font-display text-2xl font-semibold text-ink">About this place</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{destination.description}</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-ink">Accessibility</h2>
            <ul className="mt-4 space-y-2.5">
              {destination.accessibility.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="grid gap-8 sm:grid-cols-2">
            <section>
              <h3 className="font-display text-lg font-semibold text-ink">Activities</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {destination.activities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-tint px-3 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>
            <section>
              <h3 className="font-display text-lg font-semibold text-ink">Amenities</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {destination.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-surface-2 border border-edge px-3 py-1.5 text-xs font-medium text-ink-soft"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Reviews */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Traveler Reviews
              </h2>
              {rating > 0 && (
                <span className="flex items-center gap-1.5 text-sm">
                  <RatingStars rating={rating} />
                  <span className="font-semibold text-ink">{rating} / 5</span>
                </span>
              )}
            </div>

            {destination.reviews && destination.reviews.length > 0 ? (
              <div className="mt-5 space-y-4">
                {destination.reviews.map((r) => (
                  <div key={r.author + r.date} className="rounded-2xl border border-edge bg-surface p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-ink">{r.author}</p>
                      <RatingStars rating={r.rating} size={13} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.comment}</p>
                    {r.date && <p className="mt-2 text-xs text-ink-faint">{r.date}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl border border-dashed border-brand-200 bg-tint/50 p-6 text-center text-sm text-ink-faint">
                No reviews yet. Be the first to share your experience!
              </p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-edge shadow-sm">
            <div className="isolate relative h-56 w-full">
              <MiniMap lat={destination.coordinates.lat} lng={destination.coordinates.lng} />
            </div>
            <div className="grid grid-cols-2 divide-x divide-edge border-t border-edge">
              <a
                href={googleMapsDirectionsUrl(destination.coordinates.lat, destination.coordinates.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-surface py-3 text-xs font-semibold text-ink transition-colors hover:bg-tint"
              >
                <Navigation size={14} className="text-brand-500" /> Google Maps
              </a>
              <a
                href={wazeUrl(destination.coordinates.lat, destination.coordinates.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-surface py-3 text-xs font-semibold text-ink transition-colors hover:bg-tint"
              >
                <Navigation size={14} className="text-brand-500" /> Waze
              </a>
            </div>
          </div>

          {destination.contact && (
            <div className="rounded-3xl border border-edge bg-surface p-6">
              <h3 className="font-display text-base font-semibold text-ink">Contact & Socials</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {destination.contact.phone && (
                  <li className="flex items-center gap-2.5 text-ink-soft">
                    <Phone size={15} className="text-brand-500" /> {destination.contact.phone}
                  </li>
                )}
                {destination.contact.email && (
                  <li className="flex items-center gap-2.5 text-ink-soft">
                    <Mail size={15} className="text-brand-500" /> {destination.contact.email}
                  </li>
                )}
                {destination.contact.website && (
                  <li className="flex items-center gap-2.5 text-ink-soft">
                    <Globe size={15} className="text-brand-500" />
                    <a href={destination.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">
                      Website
                    </a>
                  </li>
                )}
                {destination.contact.facebook && (
                  <li className="flex items-center gap-2.5 text-ink-soft">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-tint-strong text-[10px] font-bold text-brand-700 dark:text-brand-300">FB</span>
                    <a href={destination.contact.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">
                      Facebook Page
                    </a>
                  </li>
                )}
                {destination.contact.instagram && (
                  <li className="flex items-center gap-2.5 text-ink-soft">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-tint-strong text-[10px] font-bold text-brand-700 dark:text-brand-300">IG</span>
                    <a href={destination.contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">
                      Instagram
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {destination.googleMapsUrl && (
            <a
              href={destination.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-3xl bg-ink p-6 text-center text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
            >
              Open in Google Maps ↗
            </a>
          )}

          {destination.booking && (
            <div className="rounded-3xl border border-edge bg-tint/60 p-6">
              <h3 className="font-display text-base font-semibold text-ink">Booking</h3>
              <p className="mt-2 text-sm text-ink-soft">
                {destination.booking.available
                  ? "Advance booking available."
                  : "No advance booking required."}
              </p>
              {destination.booking.note && (
                <p className="mt-2 text-xs text-ink-faint">{destination.booking.note}</p>
              )}
              {destination.booking.url && (
                <a
                  href={destination.booking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-full bg-brand-500 px-5 py-2.5 text-xs font-semibold text-white"
                >
                  Book Now
                </a>
              )}
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink">You might also like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div>
      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
        <Icon size={13} className="text-brand-500" /> {label}
      </span>
      <p className="mt-1.5 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
