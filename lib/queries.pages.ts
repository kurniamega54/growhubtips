import { db, schema } from "@/lib/db";
import { eq, and, desc, asc } from "drizzle-orm";
import type {
  PageContentData,
  AboutPageData,
  ContactPageData,
  OfficeHours,
  TimelineEvent,
  TeamMember,
  FAQItem,
} from "@/lib/types/pages";
import { cache } from "react";

/**
 * Core data fetching functions for pages
 * All functions are cached for Next.js App Router optimization
 */

export const getPageContent = cache(
  async (slug: string): Promise<PageContentData | null> => {
    try {
      const page = await db.query.pageContent.findFirst({
        where: eq(schema.pageContent.slug, slug),
        with: {
          creator: true,
        },
      });

      if (!page || page.status !== "published") {
        return null;
      }

      return {
        id: page.id,
        slug: page.slug,
        title: page.title,
        metaDescription: page.metaDescription ?? undefined,
        heroTitle: page.heroTitle ?? undefined,
        heroSubtitle: page.heroSubtitle ?? undefined,
        heroImage: page.heroImage ?? undefined,
        content: (page.content as Record<string, unknown>) || {},
        sections: (page.sections as any[]) || [],
        status: page.status as "published" | "draft" | "archived",
        publishedAt: page.publishedAt ?? undefined,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      };
    } catch (error) {
      console.error(`[getPageContent] Error fetching page "${slug}":`, error);
      return null;
    }
  }
);

export const getAboutPageData = cache(
  async (): Promise<AboutPageData | null> => {
    try {
      const page = await db.query.pageContent.findFirst({
        where: and(
          eq(schema.pageContent.slug, "about"),
          eq(schema.pageContent.status, "published")
        ),
        with: {
          timelineEvents: {
            orderBy: asc(schema.timelineEvents.year),
          },
          teamMembers: {
            orderBy: asc(schema.teamMembers.sortOrder),
            with: {
              author: true,
            },
          },
        },
      });

      if (!page) {
        // Return default data if page doesn't exist in database
        return {
          id: "default-about",
          slug: "about",
          title: "About GrowHubTips",
          metaDescription: "Learn about GrowHubTips and how we empower gardening enthusiasts with professional knowledge and tools",
          heroTitle: "About GrowHubTips",
          heroSubtitle: "Empowering gardeners with expert knowledge and professional tools",
          heroImage: undefined,
          content: {},
          sections: [],
          status: "published",
          publishedAt: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          timeline: [],
          team: [],
        };
      }

      return {
        id: page.id,
        slug: page.slug,
        title: page.title,
        metaDescription: page.metaDescription ?? undefined,
        heroTitle: page.heroTitle ?? undefined,
        heroSubtitle: page.heroSubtitle ?? undefined,
        heroImage: page.heroImage ?? undefined,
        content: (page.content as Record<string, unknown>) || {},
        sections: (page.sections as any[]) || [],
        status: page.status as "published" | "draft" | "archived",
        publishedAt: page.publishedAt ?? undefined,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        timeline: page.timelineEvents.map((event) => ({
          id: event.id,
          year: event.year,
          month: event.month ?? undefined,
          title: event.title,
          description: event.description ?? undefined,
          icon: event.icon ?? undefined,
          imageUrl: event.imageUrl ?? undefined,
          sortOrder: event.sortOrder ?? 0,
        })),
        team: page.teamMembers.map((member) => ({
          id: member.id,
          name: member.name,
          role: member.role,
          bio: member.bio ?? undefined,
          credentials: member.credentials ?? undefined,
          expertise: (member.expertise as string[]) || [],
          imageUrl: member.imageUrl ?? undefined,
          socialLinks: (member.socialLinks as Record<string, string>) || {},
          reputationScore: member.authorId
            ? parseFloat(member.author?.reputationScore as any) || 0
            : undefined,
          sortOrder: member.sortOrder ?? 0,
        })),
      };
    } catch (error) {
      console.error("[getAboutPageData] Error:", error);
      // Return default data on error
      return {
        id: "default-about",
        slug: "about",
        title: "About GrowHubTips",
        metaDescription: "Learn about GrowHubTips and how we empower gardening enthusiasts with professional knowledge and tools",
        heroTitle: "About GrowHubTips",
        heroSubtitle: "Empowering gardeners with expert knowledge and professional tools",
        heroImage: undefined,
        content: {},
        sections: [],
        status: "published",
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        timeline: [],
        team: [],
      };
    }
  }
);

export const getContactPageData = cache(
  async (): Promise<ContactPageData | null> => {
    try {
      const [page, hours, faq] = await Promise.all([
        db.query.pageContent.findFirst({
          where: and(
            eq(schema.pageContent.slug, "contact"),
            eq(schema.pageContent.status, "published")
          ),
        }),
        db.query.officeHours.findMany({
          orderBy: asc(schema.officeHours.dayOfWeek),
        }),
        db.query.faqItems.findMany({
          orderBy: asc(schema.faqItems.sortOrder),
        }),
      ]);

      if (!page) {
        // Return default contact page data
        return {
          id: "default-contact",
          slug: "contact",
          title: "Contact Us",
          metaDescription: "Get in touch with GrowHubTips for expert advice, partnerships, or general inquiries",
          heroTitle: "Contact Our Experts",
          heroSubtitle: "We're here to help with any gardening questions",
          heroImage: undefined,
          content: {},
          sections: [],
          status: "published",
          publishedAt: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          officeHours: [],
          faqItems: [],
          clinicAvailable: false,
        };
      }

      return {
        id: page.id,
        slug: page.slug,
        title: page.title,
        metaDescription: page.metaDescription ?? undefined,
        heroTitle: page.heroTitle ?? undefined,
        heroSubtitle: page.heroSubtitle ?? undefined,
        heroImage: page.heroImage ?? undefined,
        content: (page.content as Record<string, unknown>) || {},
        sections: (page.sections as any[]) || [],
        status: page.status as "published" | "draft" | "archived",
        publishedAt: page.publishedAt ?? undefined,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        officeHours: hours.map((h) => ({
          dayOfWeek: h.dayOfWeek,
          startTime: h.startTime,
          endTime: h.endTime,
          isOpen: h.isOpen ?? false,
          timezone: h.timezone ?? "UTC",
        })),
        faqItems: faq
          .filter(item => item.pageId === null || item.pageId === page.id)
          .map((item) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            category: item.category ?? undefined,
            sortOrder: item.sortOrder ?? 0,
          })),
        clinicAvailable: hours.some((h) => h.isOpen),
      };
    } catch (error) {
      console.error("[getContactPageData] Error:", error);
      // Return default contact data on error
      return {
        id: "default-contact",
        slug: "contact",
        title: "Contact Us",
        metaDescription: "Get in touch with GrowHubTips for expert advice, partnerships, or general inquiries",
        heroTitle: "Contact Our Experts",
        heroSubtitle: "We're here to help with any gardening questions",
        heroImage: undefined,
        content: {},
        sections: [],
        status: "published",
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        officeHours: [],
        faqItems: [],
        clinicAvailable: false,
      };
    }
  }
);

export const getPrivacyPageData = cache(
  async (): Promise<PageContentData | null> => {
    return getPageContent("privacy");
  }
);

export const getAffiliatePageData = cache(
  async (): Promise<PageContentData | null> => {
    return getPageContent("affiliate");
  }
);

export const getFAQItems = async (pageId: string): Promise<FAQItem[]> => {
  try {
    const items = await db.query.faqItems.findMany({
      where: and(
        eq(schema.faqItems.pageId, pageId),
        eq(schema.faqItems.isPublished, true)
      ),
      orderBy: asc(schema.faqItems.sortOrder),
    });

    return items.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      category: item.category ?? undefined,
      sortOrder: item.sortOrder ?? 0,
    }));
  } catch (error) {
    console.error("[getFAQItems] Error:", error);
    return [];
  }
};

export const getOfficeHours = cache(
  async (): Promise<OfficeHours[]> => {
    try {
      const hours = await db.query.officeHours.findMany({
        orderBy: asc(schema.officeHours.dayOfWeek),
      });

      return hours.map((h) => ({
        dayOfWeek: h.dayOfWeek,
        startTime: h.startTime,
        endTime: h.endTime,
        isOpen: h.isOpen ?? false,
        timezone: h.timezone ?? "UTC",
      }));
    } catch (error) {
      console.error("[getOfficeHours] Error:", error);
      return [];
    }
  }
);

export const getTeamMembers = cache(
  async (pageId: string): Promise<TeamMember[]> => {
    try {
      const members = await db.query.teamMembers.findMany({
        where: eq(schema.teamMembers.pageId, pageId),
        orderBy: asc(schema.teamMembers.sortOrder),
        with: {
          author: true,
        },
      });

      return members.map((member) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        bio: member.bio ?? undefined,
        credentials: member.credentials ?? undefined,
        expertise: (member.expertise as string[]) || [],
        imageUrl: member.imageUrl ?? undefined,
        socialLinks: (member.socialLinks as Record<string, string>) || {},
        sortOrder: member.sortOrder ?? 0,
      }));
    } catch (error) {
      console.error("[getTeamMembers] Error:", error);
      return [];
    }
  }
);
