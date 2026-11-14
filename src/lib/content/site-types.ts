// Row shapes for editable site content (shared by the public site and the dashboard).

export type ServiceStat = { value: string; label: string; icon: string };
export type ServiceDetail = { title: string; content: string };

export type Service = {
  slug: string;
  icon: string;
  title: string;
  card_title: string;
  card_description: string;
  summary: string;
  subtitle: string;
  description: string;
  image_url: string | null;
  features: string[];
  stats: ServiceStat[];
  details: ServiceDetail[];
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  image_url: string | null;
  specialties: string[];
  linkedin_url: string | null;
  email: string | null;
};

export type PortfolioItem = {
  id: number;
  title: string;
  category: string;
  client: string;
  description: string;
  image_url: string | null;
};

export type TeamStat = { id: number; value: string; label: string; icon: string };

export type Testimonial = { id: number; quote: string; author: string; role: string; company: string };

export type SiteSettings = {
  email: string;
  phone_primary: string;
  phone_secondary: string;
  whatsapp: string;
  address: string;
  digital_address: string;
  map_lat: number | null;
  map_lng: number | null;
  facebook_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  po_box: string;
  working_hours: string[];
};

/** "+233 24 217 8378" -> "+233242178378" for tel: links. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function whatsappHref(digits: string, text?: string): string {
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
