/**
 * Page Content Types - Enterprise Static Pages CMS
 */

export interface PageContentData {
  id: string;
  slug: string;
  title: string;
  metaDescription?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  content: Record<string, unknown>;
  sections: PageSection[];
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageSection {
  id: string;
  type: "text" | "image" | "timeline" | "team" | "cta" | "testimonial" | "stats";
  title?: string;
  content?: string | Record<string, unknown>;
  order?: number;
}

export interface TimelineEvent {
  id: string;
  year: number;
  month?: number;
  title: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  credentials?: string;
  expertise: string[];
  imageUrl?: string;
  socialLinks?: Record<string, string>;
  reputationScore?: number;
  sortOrder: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  sortOrder: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: "general" | "clinic" | "expert";
}

export interface ContactFormSubmission extends ContactFormData {
  id: string;
  priority: "low" | "normal" | "high";
  status: "received" | "read" | "responded" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export interface OfficeHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isOpen: boolean;
  timezone: string;
}

// Page-specific response types
export interface AboutPageData extends PageContentData {
  timeline?: TimelineEvent[];
  team?: TeamMember[];
  stats?: {
    postsPublished: number;
    totalReaders: number;
    expertAuthors: number;
    yearsFounded: number;
  };
}

export interface ContactPageData extends PageContentData {
  officeHours?: OfficeHours[];
  faqItems?: FAQItem[];
  clinicAvailable: boolean;
}

export interface PrivacyPageData extends PageContentData {
  sections: PageSection[];
}

export interface AffiliatePageData extends PageContentData {
  commissionRate?: number;
  cookieDuration?: number;
}

// JSON-LD Schema types
export interface OrganizationSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  address: {
    "@type": string;
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
  };
  contactPoint: {
    "@type": string;
    contactType: string;
    email: string;
    telephone: string;
  };
}

export interface ContactPageSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
}
