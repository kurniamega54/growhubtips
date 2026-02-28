import type { OrganizationSchema, ContactPageSchema } from "@/lib/types/pages";

/**
 * JSON-LD Schema Generators
 * SEO-optimized structured data for search engines
 */

export const generateOrganizationSchema = (): OrganizationSchema => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GrowHubTips",
  url: "https://growhubtips.com",
  logo: "https://growhubtips.com/logo.svg",
  description:
    "A specialized platform for gardening and home cultivation with professional tools and expert specialists",
  sameAs: [
    "https://facebook.com/growhubtips",
    "https://instagram.com/growhubtips",
    "https://twitter.com/growhubtips",
    "https://youtube.com/@growhubtips",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "تقنة الرياض، المملكة العربية السعودية",
    addressLocality: "الرياض",
    addressCountry: "SA",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    email: "info@growhubtips.com",
    telephone: "+966-XXX-XXXX",
  },
});

export const generateContactPageSchema = (): ContactPageSchema => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "تواصل مع GrowHubTips",
  description: "اتصل بنا للاستفسار عن الخدمات والاستشارات المتخصصة",
  url: "https://growhubtips.com/contact",
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Framer Motion animation variants
 */
export const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

export const slideInRightVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

export const hoverScaleVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

export const rotateEnterVariants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: (custom?: number) => ({
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      delay: (custom || 0) * 0.1,
    },
  }),
};

/**
 * Utility helpers
 */

export const getDayName = (dayOfWeek: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayOfWeek] || "يوم";
};

export const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "م" : "ص";
    const displayHours = hours > 12 ? hours - 12 : hours || 12;
    return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
  } catch {
    return time;
  }
};

export const isCurrentlyOpen = (
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  timezone: string = "UTC"
): boolean => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

  return currentDay === dayOfWeek && currentTime >= startTime && currentTime <= endTime;
};

export const getNextOpeningTime = (officeHours: Array<{ dayOfWeek: number; startTime: string; isOpen: boolean }>) => {
  const now = new Date();
  const currentDay = now.getDay();

  // Check remaining hours today
  const todayHours = officeHours.find((h) => h.dayOfWeek === currentDay);
  if (todayHours?.isOpen) {
    return `اليوم الساعة ${formatTime(todayHours.startTime)}`;
  }

  // Find next open day
  for (let i = 1; i <= 7; i++) {
    const checkDay = (currentDay + i) % 7;
    const nextHours = officeHours.find((h) => h.dayOfWeek === checkDay);
    if (nextHours?.isOpen) {
      return `${getDayName(checkDay)} الساعة ${formatTime(nextHours.startTime)}`;
    }
  }

  return "قريباً جداً";
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Extract Plain Text from Tiptap Editor JSON
 * Converts Editor JSON format to plain text for meta descriptions
 * Removes all formatting, links, embeds, etc.
 * 
 * @param json - Tiptap editor JSON content
 * @returns Plain text string
 */
export const extractTextFromEditorJson = (json: Record<string, unknown> | null | undefined): string => {
  if (!json) return "";

  const textParts: string[] = [];

  function walkNode(node: any): void {
    if (!node) return;

    // Extract text from text nodes
    if (node.type === "text" && node.text) {
      textParts.push(node.text);
    }

    // For any node with content, recursively process children
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child: any) => walkNode(child));
    }

    // Handle paragraph and other block types
    if (node.type === "paragraph" && node.content) {
      node.content.forEach((child: any) => walkNode(child));
    }

    // Handle heading blocks
    if ((node.type?.startsWith("heading") || node.type === "heading") && node.content) {
      node.content.forEach((child: any) => walkNode(child));
    }

    // Handle list items
    if (node.type === "listItem" && node.content) {
      node.content.forEach((child: any) => walkNode(child));
    }

    // Handle custom blocks (plant care, pro tips, etc.)
    if (node.type === "plantCareCard" || node.type === "proTipCallout" || node.type === "growthTimeline") {
      // Extract any text from attrs if present
      if (node.attrs?.title) textParts.push(String(node.attrs.title));
      if (node.attrs?.content) textParts.push(String(node.attrs.content));
      if (node.attrs?.description) textParts.push(String(node.attrs.description));
    }

    // Handle tables
    if (node.type === "table" && node.content) {
      node.content.forEach((row: any) => walkNode(row));
    }
    if (node.type === "tableRow" && node.content) {
      node.content.forEach((cell: any) => walkNode(cell));
    }
    if ((node.type === "tableCell" || node.type === "tableHeader") && node.content) {
      node.content.forEach((child: any) => walkNode(child));
    }

    // Handle blockquote
    if (node.type === "blockquote" && node.content) {
      node.content.forEach((child: any) => walkNode(child));
    }

    // Handle images and embeds (add alt text if available)
    if (node.type === "smartImage" || node.type === "image") {
      if (node.attrs?.alt) textParts.push(String(node.attrs.alt));
    }

    if (node.type === "embedBlock") {
      if (node.attrs?.title) textParts.push(String(node.attrs.title));
    }
  }

  // Start walking from the root (should be "doc" type)
  if (json.content && Array.isArray(json.content)) {
    json.content.forEach((node: any) => walkNode(node));
  } else {
    walkNode(json);
  }

  // Clean up text: trim, remove extra whitespace, limit length
  let result = textParts
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return result;
};

/**
 * Generate Meta Description from Editor JSON
 * Extracts text and truncates to SEO-optimal length (155-160 chars)
 * 
 * @param json - Tiptap editor JSON content
 * @param preferredLength - Target length (default: 155)
 * @returns Meta description string
 */
export const generateMetaDescriptionFromJson = (
  json: Record<string, unknown> | null | undefined,
  preferredLength: number = 155
): string => {
  const plainText = extractTextFromEditorJson(json);

  if (!plainText) {
    return "Explore our gardening tips and expert advice on plant care. 🌱";
  }

  // Truncate to preferred length
  if (plainText.length > preferredLength) {
    // Try to break at a word boundary
    const truncated = plainText.substring(0, preferredLength);
    const lastSpace = truncated.lastIndexOf(" ");
    
    if (lastSpace > preferredLength - 20) {
      return truncated.substring(0, lastSpace) + "...";
    }

    return truncated.trim() + "...";
  }

  return plainText;
};

/**
 * Calculate SEO Reading Time from Editor JSON
 * Estimates reading time based on word count
 * Average reading speed: 200 words per minute
 * 
 * @param json - Tiptap editor JSON content
 * @returns Reading time in minutes
 */
export const calculateReadingTimeFromJson = (
  json: Record<string, unknown> | null | undefined
): number => {
  const plainText = extractTextFromEditorJson(json);
  const wordCount = plainText.split(/\s+/).filter((word) => word.length > 0).length;
  const readingSpeed = 200; // words per minute
  const minutes = Math.max(1, Math.round(wordCount / readingSpeed));
  return minutes;
};
