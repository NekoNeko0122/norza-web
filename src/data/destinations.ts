// ---------------------------------------------------------------------------
// Norzagaray Tourism — Destinations Data
// ---------------------------------------------------------------------------
// This file is the single source of truth for every destination on the site.
// To add a new place, append a new object to the `destinations` array below
// following the `Destination` shape. See README.md for a full field guide.
// ---------------------------------------------------------------------------

export type DestinationCategory =
  | "nature"
  | "adventure"
  | "heritage"
  | "religious"
  | "park"
  | "viewpoint";

export interface DestinationContact {
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  messenger?: string;
}

export interface DestinationReview {
  author: string;
  rating: number; // 1-5
  comment: string;
  date?: string; // e.g. "March 2026"
}

export interface DestinationBooking {
  available: boolean;
  note?: string;
  url?: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  category: DestinationCategory;
  barangay: string;
  address: string;
  shortDescription: string;
  description: string;

  coordinates: { lat: number; lng: number };
  /** true once coordinates have been confirmed on-site / against Google Maps */
  coordinatesVerified: boolean;
  /** whether this place is already registered as a location on Google Maps */
  onGoogleMaps: boolean;
  googleMapsUrl?: string;

  entranceFee?: string;
  openHours?: string;
  bestTimeToVisit?: string;
  difficulty?: "easy" | "moderate" | "challenging";

  accessibility: string[];
  activities: string[];
  amenities: string[];

  contact?: DestinationContact;
  booking?: DestinationBooking;
  reviews?: DestinationReview[];

  /** gradient used for the placeholder hero art until real photos are added */
  gradient: [string, string];
  images?: string[];

  tags: string[];
  featured?: boolean;
}

export const destinations: Destination[] = [
  {
    id: "pinagrealan-cave",
    slug: "pinagrealan-cave",
    name: "Pinagrealan Cave",
    category: "heritage",
    barangay: "Minuyan",
    address: "Sitio Upper Bigte, Barangay Minuyan, Norzagaray, Bulacan",
    shortDescription:
      "A kilometer-long limestone cavern once used as a hideout by Andres Bonifacio and the Katipuneros.",
    description:
      "Pinagrealan Cave is one of Norzagaray's most historically significant sites, a natural limestone cavern that served as a hideout for Filipino revolutionaries, including Andres Bonifacio and the Katipunan, during the Spanish and American colonial periods. Inside, guided spelunking trails wind past smooth stalagmites, pointed stalactites, and a striking circular chamber ceiling. It's a great half-day adventure for history buffs and first-time cavers alike.",
    coordinates: { lat: 14.8867, lng: 121.0983 },
    coordinatesVerified: false,
    onGoogleMaps: true,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pinagrealan+Cave+Norzagaray+Bulacan",
    entranceFee: "₱50 (includes cave gear) + ₱60 guide fee per person",
    openHours: "8:00 AM – 4:00 PM daily",
    bestTimeToVisit: "Dry season (November – May), avoid after heavy rain",
    difficulty: "moderate",
    accessibility: [
      "Reachable by private vehicle or habal-habal (motorcycle-for-hire) from the town proper",
      "Short uphill trek to the cave mouth before entering",
      "Not wheelchair accessible: narrow, uneven cave passages",
      "A local guide is required and included in the fee",
    ],
    activities: ["Spelunking", "Historical tour", "Photography"],
    amenities: ["Cave gear rental", "Local guides", "Parking area", "Sari-sari stores nearby"],
    contact: {
      phone: "(044) 791-6604",
      email: "psyeaco@bulacan.gov.ph",
    },
    booking: {
      available: false,
      note: "Walk-ins accommodated; groups are encouraged to coordinate ahead with the Bulacan Provincial Tourism Office.",
    },
    reviews: [
      {
        author: "Jasmine R.",
        rating: 5,
        comment: "Such a hidden gem! Our guide shared so much history about the Katipuneros. A bit muddy so wear old shoes.",
        date: "February 2026",
      },
      {
        author: "Miguel T.",
        rating: 4,
        comment: "Cool and quiet inside, great escape from the heat. Bring a headlamp for extra light.",
        date: "December 2025",
      },
    ],
    gradient: ["#f472b6", "#a855f7"],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/0106jfRoads_Welcome_Bigte_Norzagaray_Pinagrealan_Cave_villagesfvf_03.JPG/960px-0106jfRoads_Welcome_Bigte_Norzagaray_Pinagrealan_Cave_villagesfvf_03.JPG",
    ],
    tags: ["cave", "history", "adventure", "spelunking", "katipunan"],
    featured: true,
  },
  {
    id: "ipo-dam-view-deck",
    slug: "ipo-dam-view-deck",
    name: "Ipo Dam View Deck (Tanawan)",
    category: "viewpoint",
    barangay: "San Mateo",
    address: "Brgy. San Mateo, Norzagaray, Bulacan",
    shortDescription:
      "A cliffside lookout with an unobstructed view of Ipo Dam framed by the Sierra Madre mountain range.",
    description:
      "Locally known as \"Tanawan,\" the Ipo Dam View Deck is a favorite golden-hour spot for photographers and day-trippers. From the ridge, visitors get a sweeping view of Ipo Dam's turquoise waters set against the Sierra Madre mountains, one of the best sunrise and sunset viewpoints near Metro Manila.",
    coordinates: { lat: 14.836, lng: 121.1263 },
    coordinatesVerified: false,
    onGoogleMaps: true,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ipo+Dam+View+Deck+Norzagaray+Bulacan",
    entranceFee: "₱5 – ₱10 donation",
    openHours: "6:00 AM – 6:00 PM daily",
    bestTimeToVisit: "Sunrise or late afternoon for the best light",
    difficulty: "easy",
    accessibility: [
      "Best reached by private vehicle or motorcycle: limited public transport",
      "Tricycles for hire from Barangay Bigte (~₱300 one-way as of last check)",
      "Short walk from the parking area to the viewing ridge",
      "Not wheelchair accessible: unpaved cliffside terrain",
    ],
    activities: ["Sightseeing", "Photography", "Picnics"],
    amenities: ["Small sari-sari store", "Limited parking"],
    reviews: [
      {
        author: "Cathy L.",
        rating: 5,
        comment: "Best sunrise view near Manila! Go early and bring water, no shade on the ridge.",
        date: "January 2026",
      },
    ],
    gradient: ["#fb7185", "#f9a8d4"],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/09596jfWatershed_Dams_San_Mateo_Lorenzo_Hilltop_Norzagaray_Bulacanfvf_25.JPG/960px-09596jfWatershed_Dams_San_Mateo_Lorenzo_Hilltop_Norzagaray_Bulacanfvf_25.JPG",
    ],
    tags: ["viewpoint", "dam", "sunrise", "mountains", "photography"],
    featured: true,
  },
  {
    id: "bitbit-river-park",
    slug: "bitbit-norzagaray-river-park",
    name: "Bitbit Norzagaray River Park",
    category: "park",
    barangay: "Bigte",
    address: "Barangay Bigte, Norzagaray, Bulacan",
    shortDescription:
      "A riverside park with mountain views, a refreshing swimming spot, and the iconic 100-foot Bitbit hanging bridge.",
    description:
      "Bitbit Norzagaray River Park pairs cool river swimming with a scenic 100-foot hanging bridge that's become an Instagram favorite for thrill-seekers. Surrounded by mountains and greenery, the park is a popular weekend escape for families and riders passing through on their way to Ipo Dam.",
    coordinates: { lat: 14.8391, lng: 121.1187 },
    coordinatesVerified: false,
    onGoogleMaps: true,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bitbit+River+Park+Norzagaray+Bulacan",
    entranceFee: "₱20 – ₱50 (varies by area operator)",
    openHours: "7:00 AM – 6:00 PM daily",
    bestTimeToVisit: "Summer (March – May) for swimming",
    difficulty: "easy",
    accessibility: [
      "Accessible by private vehicle or motorcycle via Barangay Bigte",
      "Riverbank access involves uneven, sometimes slippery terrain",
      "Not wheelchair accessible",
    ],
    activities: ["Swimming", "River trekking", "Bridge crossing", "Motorcycle riding routes"],
    amenities: ["Cottages for rent", "Food stalls", "Parking", "Changing area"],
    reviews: [
      {
        author: "Ronnel A.",
        rating: 4,
        comment: "Fun stop for riders! The hanging bridge gives a nice adrenaline rush. Water's clean during summer.",
        date: "April 2026",
      },
    ],
    gradient: ["#f9a8d4", "#c084fc"],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/01408jfHilltop_San_Mateo_Sitio_Bitbit_Lorenzo_River_Bridge_Norzagaray_Bulacan_villagesfvf_07.JPG/960px-01408jfHilltop_San_Mateo_Sitio_Bitbit_Lorenzo_River_Bridge_Norzagaray_Bulacan_villagesfvf_07.JPG",
    ],
    tags: ["river", "bridge", "swimming", "park", "family"],
    featured: true,
  },
  {
    id: "cely-farm",
    slug: "cely-farm",
    name: "Cely Farm",
    category: "park",
    barangay: "San Mateo",
    address: "Brgy. San Mateo, Norzagaray, Bulacan",
    shortDescription:
      "A hidden-gem farm getaway with mountain views, fresh air, and budget-friendly camping and picnic grounds.",
    description:
      "Cely Farm (also known as \"Cely Farm View\") is a quiet, family-run spot in San Mateo offering a taste of rural provincial life just outside the town proper. With sweeping mountain views and open grassy grounds, it's a favorite for camping, picnics, birthdays, and overnight bonding with friends and family. Tents can be rented on-site or brought along, and the farm is pet-friendly.",
    coordinates: { lat: 14.8695931, lng: 121.1201628 },
    coordinatesVerified: true,
    onGoogleMaps: true,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Cely+Farm+Norzagaray+Bulacan",
    entranceFee: "₱10",
    openHours: "Daily, hours vary, call ahead",
    bestTimeToVisit: "Dry season for camping and overnight stays",
    difficulty: "easy",
    accessibility: [
      "Reachable by private vehicle or motorcycle via Barangay San Mateo",
      "Open grassy grounds, generally easy walking",
      "Not wheelchair accessible: unpaved farm terrain",
    ],
    activities: ["Camping", "Picnics", "Birthdays & gatherings", "Overnight bonding", "Pet-friendly visits"],
    amenities: ["Tent rentals", "Open grounds", "Parking", "Mountain view"],
    contact: {
      phone: "+63 921 973 3589",
      website: "https://celyfarm.com",
      facebook: "https://www.facebook.com/p/Cely-Farm-view-100063961517391/",
    },
    booking: {
      available: false,
      note: "Walk-ins welcome; call ahead for group reservations or tent rentals.",
    },
    reviews: [],
    gradient: ["#86efac", "#f472b6"],
    tags: ["farm", "camping", "picnic", "park", "family", "pet-friendly"],
    featured: false,
  },
  {
    id: "maramo-river",
    slug: "maramo-river",
    name: "Maramo River",
    category: "nature",
    barangay: "Bigte",
    address: "Barangay Bigte, Norzagaray, Bulacan",
    shortDescription:
      "Nicknamed \"Little El Nido,\" a crystal-clear river with cliff-jumping spots and caves to explore.",
    description:
      "Maramo River earned its nickname \"Little El Nido\" for its strikingly clear, turquoise water winding between limestone cliffs. Visitors can swim, jump off low cliffs, and paddle into small caves carved along the riverbank, a compact but scenic adventure spot popular with younger travelers.",
    coordinates: { lat: 14.842, lng: 121.1145 },
    coordinatesVerified: false,
    onGoogleMaps: true,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Maramo+River+Norzagaray+Bulacan",
    entranceFee: "₱30 – ₱50 (varies by area operator)",
    openHours: "7:00 AM – 5:00 PM daily",
    bestTimeToVisit: "Summer (March – May), avoid rainy season due to strong current",
    difficulty: "moderate",
    accessibility: [
      "Accessible by private vehicle plus a short trek to the riverbank",
      "Rocky, slippery footing near the water: sturdy footwear recommended",
      "Not wheelchair accessible",
    ],
    activities: ["Swimming", "Cliff jumping", "Cave exploring", "Photography"],
    amenities: ["Small cottages", "Local guides available", "Parking nearby"],
    reviews: [
      {
        author: "Dana P.",
        rating: 5,
        comment: "The water color is unreal, like a mini El Nido! Go on a weekday to avoid crowds.",
        date: "May 2026",
      },
    ],
    gradient: ["#22d3ee", "#f472b6"],
    tags: ["river", "cliff jumping", "swimming", "cave", "nature"],
    featured: true,
  },
  {
    id: "maranat-twin-falls",
    slug: "maranat-twin-falls",
    name: "Maranat Twin Falls",
    category: "nature",
    barangay: "Pinaod",
    address: "Barangay Pinaod, Norzagaray, Bulacan",
    shortDescription:
      "Two cascading waterfalls tucked in lush, rolling terrain, ideal for camping and hiking.",
    description:
      "Maranat Twin Falls features two side-by-side cascades flowing into cool, shallow pools, framed by fruit-bearing trees and rolling greenery. The surrounding trail is popular with hikers and campers looking for an overnight escape close to the metro.",
    coordinates: { lat: 14.9235, lng: 121.0805 },
    coordinatesVerified: false,
    onGoogleMaps: false,
    accessibility: [
      "Requires a guided hike from the trailhead: no direct vehicle access to the falls",
      "Moderate trekking terrain with stream crossings",
      "Not wheelchair accessible",
    ],
    activities: ["Hiking", "Camping", "Swimming", "Nature photography"],
    amenities: ["Designated camping area", "Local guides", "Basic parking at trailhead"],
    bestTimeToVisit: "Dry season for safer trail conditions",
    difficulty: "challenging",
    entranceFee: "₱50 environmental fee (approximate)",
    reviews: [
      {
        author: "Kevin S.",
        rating: 5,
        comment: "Camped overnight near the falls. Peaceful, and the cold water is so refreshing after the hike.",
        date: "March 2026",
      },
    ],
    gradient: ["#a855f7", "#ec4899"],
    tags: ["waterfall", "hiking", "camping", "nature"],
    featured: false,
  },
  {
    id: "bakas-river",
    slug: "bakas-river",
    name: "Bakas River",
    category: "nature",
    barangay: "Pinaod",
    address: "Barangay Pinaod, Norzagaray, Bulacan (part of the Angat River)",
    shortDescription:
      "A stretch of the Angat River known for its big white boulders, calm current, and green scenery.",
    description:
      "One of the busiest local swimming spots come summer, Bakas River is a scenic portion of the Angat River lined with large natural white stones. Its calm, gently flowing current and fresh mountain air make it a relaxed alternative to the more adventurous spots nearby.",
    coordinates: { lat: 14.9022, lng: 121.0891 },
    coordinatesVerified: false,
    onGoogleMaps: false,
    accessibility: [
      "Accessible by private vehicle plus a short walk to the riverbank",
      "Uneven, rocky terrain along the shore",
      "Not wheelchair accessible",
    ],
    activities: ["Swimming", "Picnics", "River tubing"],
    amenities: ["Cottages", "Food vendors during peak season", "Parking"],
    bestTimeToVisit: "Summer (March – May)",
    difficulty: "easy",
    entranceFee: "₱20 – ₱30 (varies by area operator)",
    reviews: [],
    gradient: ["#38bdf8", "#e879f9"],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/01975jfAngat_Matictic_Bakas_Kankayan_Balugan_Tourism_Rivers_Norzagaray_Bulacan_villagesfvf_03.JPG/960px-01975jfAngat_Matictic_Bakas_Kankayan_Balugan_Tourism_Rivers_Norzagaray_Bulacan_villagesfvf_03.JPG",
    ],
    tags: ["river", "swimming", "family", "picnic"],
    featured: false,
  },
  {
    id: "norzagaray-church",
    slug: "st-andrew-the-apostle-parish",
    name: "St. Andrew the Apostle Parish (Norzagaray Church)",
    category: "religious",
    barangay: "Poblacion",
    address: "Barangay Poblacion, Norzagaray, Bulacan",
    shortDescription:
      "The town's historic Spanish-era parish, established in 1787 and dedicated to St. Andrew the Apostle.",
    description:
      "Also known as \"Parokya ni San Andres Apostol,\" this parish under the Diocese of Malolos traces its roots to 1787. The original adobe church was razed by fire and rebuilt in a modern style in the 1950s. It remains the spiritual heart of Norzagaray, hosting the town's lively fiesta every November 30 in honor of its patron saint.",
    coordinates: { lat: 14.9114, lng: 121.0453 },
    coordinatesVerified: false,
    onGoogleMaps: true,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=St+Andrew+the+Apostle+Parish+Norzagaray+Bulacan",
    entranceFee: "Free",
    openHours: "6:00 AM – 7:00 PM daily; Mass schedules vary",
    bestTimeToVisit: "Town fiesta, November 30",
    difficulty: "easy",
    accessibility: [
      "Located at the town proper: accessible by tricycle, jeepney, or private vehicle",
      "Paved grounds, generally accessible for most visitors",
    ],
    activities: ["Church visit", "Prayer", "Cultural & heritage appreciation"],
    amenities: ["Parking nearby", "Eateries and stores within the town proper"],
    contact: {
      facebook: "https://www.facebook.com/ParokyaniSanAndresApostoldeNorzagaray/",
    },
    reviews: [
      {
        author: "Liza M.",
        rating: 5,
        comment: "Peaceful church, lovely during the November fiesta with the whole town celebrating.",
        date: "December 2025",
      },
    ],
    gradient: ["#fda4af", "#fbcfe8"],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/JfNorzagaray1705ChurchStAndrewfvf_05.JPG/960px-JfNorzagaray1705ChurchStAndrewfvf_05.JPG",
    ],
    tags: ["church", "heritage", "history", "religious"],
    featured: false,
  },
];

export function getDestinationBySlug(slug: string) {
  return destinations.find((d) => d.slug === slug);
}

export function getFeaturedDestinations() {
  return destinations.filter((d) => d.featured);
}

export const categoryMeta: Record<
  DestinationCategory,
  { label: string; icon: string }
> = {
  nature: { label: "Nature & Rivers", icon: "Trees" },
  adventure: { label: "Adventure", icon: "Compass" },
  heritage: { label: "Heritage & History", icon: "Landmark" },
  religious: { label: "Religious", icon: "Church" },
  park: { label: "Parks & Bridges", icon: "TreePine" },
  viewpoint: { label: "Viewpoints", icon: "Mountain" },
};
