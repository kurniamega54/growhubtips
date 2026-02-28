"use server";

import { db, schema } from "@/lib/db";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations/pages";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

interface FormResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Submit contact form
 * Validates input, saves to database, and triggers email notification
 */
export async function submitContactForm(
  input: unknown
): Promise<FormResponse> {
  try {
    // Validate input
    const validationResult = contactFormSchema.safeParse(input);

    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const data = validationResult.data;
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    // Determine priority based on message length and type
    let priority: "low" | "normal" | "high" = "normal";
    if (data.type === "clinic" || data.type === "expert") {
      priority = "high";
    } else if (data.message.length > 500) {
      priority = "high";
    }

    // Save to database
    const result = await db.insert(schema.contactFormSubmissions).values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      type: data.type,
      priority,
      status: "received",
      ipAddress,
      userAgent,
    });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user
    // await sendContactConfirmationEmail(data.email, data.name);
    // await notifyAdminOfNewContact(data);

    return {
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon. 🌿",
    };
  } catch (error) {
    console.error("[submitContactForm] Error:", error);
    return {
      success: false,
      message: "An error occurred while submitting the form. Please try again.",
    };
  }
}

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(email: string): Promise<FormResponse> {
  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Invalid email address",
      };
    }

    // Check if already subscribed
    const existing = await db.query.newsletterSubscribers.findFirst({
      where: eq(schema.newsletterSubscribers.email, email),
    });

    if (existing && existing.status === "verified") {
      return {
        success: false,
        message: "You are already subscribed to our newsletter",
      };
    }

    // Insert or update subscription
    if (existing) {
      // Re-enable subscription
      await db
        .update(schema.newsletterSubscribers)
        .set({
          status: "pending",
          unsubscribedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(schema.newsletterSubscribers.email, email));
    } else {
      await db.insert(schema.newsletterSubscribers).values({
        email,
        status: "pending",
      });
    }

    // TODO: Send verification email
    // await sendNewsletterVerificationEmail(email);

    return {
      success: true,
      message: "Thank you for subscribing! Check your email to confirm your subscription.",
    };
  } catch (error) {
    console.error("[subscribeNewsletter] Error:", error);
    return {
      success: false,
      message: "An error occurred during subscription. Please try again.",
    };
  }
}

/**
 * Simulate checking if clinic appointments are available
 */
export async function checkClinicAvailability(): Promise<FormResponse<{ available: boolean; nextSlot?: string }>> {
  try {
    const hours = await db.query.officeHours.findMany({
      where: eq(schema.officeHours.isOpen, true),
    });

    const isOpen = hours.length > 0;

    return {
      success: true,
      message: isOpen ? "العيادة متاحة للحجز الآن" : "العيادة مغلقة في الوقت الحالي",
      data: {
        available: isOpen,
        nextSlot: isOpen ? "09:00 AM - 05:00 PM" : undefined,
      },
    };
  } catch (error) {
    console.error("[checkClinicAvailability] Error:", error);
    return {
      success: false,
      message: "Unable to verify clinic availability",
    };
  }
}

/**
 * Update page content (About, Contact, Privacy, Affiliate)
 * Saves the Tiptap editor JSON to the page_content table
 */
export async function updatePageContent(
  slug: "about" | "contact" | "privacy" | "affiliate",
  data: {
    title: string;
    metaDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImage?: string;
    content: Record<string, unknown>; // Tiptap JSON
    status?: "draft" | "published" | "archived";
  }
): Promise<FormResponse<{ id: string }>> {
  try {
    // Validate input
    if (!slug || !data.title || !data.content) {
      return {
        success: false,
        message: "Missing required fields: slug, title, or content",
      };
    }

    // Check if page exists
    const existing = await db.query.pageContent.findFirst({
      where: eq(schema.pageContent.slug, slug),
    });

    if (existing) {
      // Update existing page
      await db
        .update(schema.pageContent)
        .set({
          title: data.title,
          metaDescription: data.metaDescription,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroImage: data.heroImage || existing.heroImage,
          content: data.content,
          status: (data.status || existing.status) as "draft" | "published" | "archived",
          updatedAt: new Date(),
          publishedAt: data.status === "published" ? new Date() : existing.publishedAt,
        })
        .where(eq(schema.pageContent.slug, slug));

      return {
        success: true,
        message: `✅ ${slug.charAt(0).toUpperCase() + slug.slice(1)} page updated successfully!`,
        data: { id: existing.id },
      };
    } else {
      // Create new page
      const result = await db
        .insert(schema.pageContent)
        .values({
          slug,
          title: data.title,
          metaDescription: data.metaDescription,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroImage: data.heroImage,
          content: data.content,
          status: (data.status || "draft") as "draft" | "published" | "archived",
          publishedAt: data.status === "published" ? new Date() : null,
        })
        .returning({ id: schema.pageContent.id });

      const pageId = result?.[0]?.id;
      if (!pageId) {
        return {
          success: false,
          message: "Failed to create page",
        };
      }

      return {
        success: true,
        message: `✅ ${slug.charAt(0).toUpperCase() + slug.slice(1)} page created successfully!`,
        data: { id: pageId },
      };
    }
  } catch (error) {
    console.error("[updatePageContent] Error:", error);
    return {
      success: false,
      message: "An error occurred while updating the page. Please try again.",
    };
  }
}

/**
 * Get page content by slug
 * Retrieves the page_content for editing
 */
export async function getPageContent(
  slug: "about" | "contact" | "privacy" | "affiliate"
): Promise<FormResponse<{
  id: string;
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  content: Record<string, unknown>;
  status: string;
}>> {
  try {
    const page = await db.query.pageContent.findFirst({
      where: eq(schema.pageContent.slug, slug),
    });

    if (!page) {
      return {
        success: false,
        message: `${slug.charAt(0).toUpperCase() + slug.slice(1)} page not found`,
      };
    }

    return {
      success: true,
      message: `Loaded ${slug} page`,
      data: {
        id: page.id,
        title: page.title,
        metaDescription: page.metaDescription || "",
        heroTitle: page.heroTitle || "",
        heroSubtitle: page.heroSubtitle || "",
        heroImage: page.heroImage || undefined,
        content: (page.content as Record<string, unknown>) || {},
        status: page.status,
      },
    };
  } catch (error) {
    console.error("[getPageContent] Error:", error);
    return {
      success: false,
      message: "An error occurred while loading the page. Please try again.",
    };
  }
}

/**
 * Publish page content
 * Changes status from draft to published
 */
export async function publishPageContent(
  slug: "about" | "contact" | "privacy" | "affiliate"
): Promise<FormResponse> {
  try {
    const page = await db.query.pageContent.findFirst({
      where: eq(schema.pageContent.slug, slug),
    });

    if (!page) {
      return {
        success: false,
        message: `${slug.charAt(0).toUpperCase() + slug.slice(1)} page not found`,
      };
    }

    await db
      .update(schema.pageContent)
      .set({
        status: "published",
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.pageContent.slug, slug));

    return {
      success: true,
      message: `🌿 ${slug.charAt(0).toUpperCase() + slug.slice(1)} page published successfully!`,
    };
  } catch (error) {
    console.error("[publishPageContent] Error:", error);
    return {
      success: false,
      message: "An error occurred while publishing the page. Please try again.",
    };
  }
}
