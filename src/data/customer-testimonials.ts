export type CustomerTestimonial = {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
};

/** Used on About (`TestimonialSection`) and Home (`TrustSection`). */
export const customerTestimonials: CustomerTestimonial[] = [
  {
    id: "chioma-ph",
    name: "Chioma E.",
    location: "Port Harcourt, Nigeria",
    quote:
      "I was honestly skeptical about ordering meat pies online — you never know. They showed up still warm, the pastry actually flakes, and the filling isn't stingy. Even my mum asked where I got them.",
    rating: 5,
  },
  {
    id: "emeka-toronto",
    name: "Emeka N.",
    location: "Toronto, Canada",
    quote:
      "Two years out here and I still crave home food every weekend. Found you on Instagram, tried the puff-puff tray for my son's class party — gone in minutes. My only complaint is I should have ordered double.",
    rating: 5,
  },
  {
    id: "funke-ikeja",
    name: "Dr. Funke A.",
    location: "Ikeja, Lagos",
    quote:
      "We did GourmetBakes for our office Friday lunch — about twenty-four people. Usually someone grumbles; this time, silence until the plates were clean. The jollof portions were generous too.",
    rating: 5,
  },
  {
    id: "yusuf-manchester",
    name: "Yusuf K.",
    location: "Manchester, UK",
    quote:
      "First delivery was slightly outside the window — stuff happens. They called ahead, apologised, and added extra chin chin without me asking. That kind of care is why I've ordered four times since.",
    rating: 5,
  },
  {
    id: "ngozi-abuja",
    name: "Ngozi O.",
    location: "Abuja, Nigeria",
    quote:
      "The birthday cake matched the reference photo I sent — down to the colours. My daughter wouldn't let anyone cut it for ten minutes because she wanted 'content' first. You made her week.",
    rating: 5,
  },
  {
    id: "adebayo-london",
    name: "Adebayo O.",
    location: "London, UK",
    quote:
      "The Agege bread is how I remember it from growing up — soft, pulls apart properly, perfect with beans. Small thing, but it genuinely felt like a piece of home on a grey Tuesday.",
    rating: 5,
  },
];

/** Subset for the home trust strip (swipe carousel). */
export const homeSpotlightTestimonials = customerTestimonials.slice(0, 4);
