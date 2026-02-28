/**
 * GrowHubTips - Database Seed Script
 * Populates: 5 authority categories + 1 SEO-optimized post with plant profile
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import {
  users,
  authors,
  categories,
  subCategories,
  posts,
  tags,
  postsToTags,
  seoMetadata,
  plantProfiles,
  mediaLibrary,
  pageContent,
  timelineEvents,
  teamMembers,
  officeHours,
  faqItems,
} from "../lib/db/schema";

async function seed() {
  console.log("🌱 Seeding GrowHubTips database...\n");

  // 1. Create media placeholder (for featured image)
  const [media] = await db
    .insert(mediaLibrary)
    .values({
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
      altText: "Lush indoor monstera plant in pot",
      title: "Monstera Indoor Plant",
      width: 800,
      height: 600,
      fileSizeBytes: 120000,
      mimeType: "image/jpeg",
    })
    .returning();
  if (!media) throw new Error("Failed to create media");
  console.log("✓ Media created");

  // 2. Create user & author (E-E-A-T profile)
  const [user] = await db
    .insert(users)
    .values({
      email: "admin@growhubtips.com",
      name: "GrowHub Team",
      role: "author",
    })
    .returning();
  if (!user) throw new Error("Failed to create user");

  const [author] = await db
    .insert(authors)
    .values({
      userId: user.id,
      displayName: "GrowHub Expert",
      slug: "growhub-expert",
      bio: "Certified horticulturist with 15+ years of urban gardening experience. Passionate about helping beginners and experts alike cultivate thriving green spaces.",
      expertCredentials: "Certified Horticulturist, Member of Royal Horticultural Society",
      socialLinks: {
        twitter: "https://twitter.com/growhubtips",
        linkedin: "https://linkedin.com/in/growhubtips",
      },
      reputationScore: "98.5",
      profileImageId: media.id,
    })
    .returning();
  if (!author) throw new Error("Failed to create author");
  console.log("✓ User & Author created");

  // 3. Create 5 authority categories
  const categoryData = [
    { name: "Indoor Plants", slug: "indoor-plants", description: "Houseplants, succulents, and tropical varieties for your home.", metaTitle: "Indoor Plants Care Guide", metaDescription: "Expert tips for growing healthy indoor plants, from beginners to advanced.", sortOrder: 1 },
    { name: "Vegetable Gardening", slug: "vegetable-gardening", description: "Grow your own food from seed to harvest.", metaTitle: "Vegetable Gardening Tips", metaDescription: "Organic vegetable gardening guides for all seasons and spaces.", sortOrder: 2 },
    { name: "Herbs & Spices", slug: "herbs-spices", description: "Culinary and medicinal herb cultivation.", metaTitle: "Herb Gardening Guide", metaDescription: "Grow fresh herbs indoors and outdoors with our expert guides.", sortOrder: 3 },
    { name: "Plant Doctor", slug: "plant-doctor", description: "Diagnose and fix common plant problems.", metaTitle: "Plant Problem Solver", metaDescription: "Identify pests, diseases, and care issues with our plant doctor.", sortOrder: 4 },
    { name: "Urban & Small Space", slug: "urban-gardening", description: "Maximize yields in balconies, patios, and small yards.", metaTitle: "Urban Gardening Tips", metaDescription: "Small space gardening solutions for city dwellers.", sortOrder: 5 },
  ];

  const insertedCategories = await db.insert(categories).values(categoryData).returning();
  console.log(`✓ ${insertedCategories.length} categories created`);

  // 4. Create sub-categories for Indoor Plants
  const indoorCategory = insertedCategories.find((c) => c.slug === "indoor-plants");
  if (indoorCategory) {
    await db.insert(subCategories).values([
      { categoryId: indoorCategory.id, name: "Succulents", slug: "succulents", sortOrder: 1 },
      { categoryId: indoorCategory.id, name: "Tropical Plants", slug: "tropical-plants", sortOrder: 2 },
      { categoryId: indoorCategory.id, name: "Air Plants", slug: "air-plants", sortOrder: 3 },
    ]);
    console.log("✓ Sub-categories created");
  }

  // 5. Create tags
  const tagData = [
    { name: "Beginner Friendly", slug: "beginner-friendly" },
    { name: "Low Light", slug: "low-light" },
    { name: "Pet Safe", slug: "pet-safe" },
    { name: "Indoor Care", slug: "indoor-care" },
  ];
  const insertedTags = await db.insert(tags).values(tagData).returning();
  console.log(`✓ ${insertedTags.length} tags created`);

  // 6. Create 1 complex SEO-optimized post
  const indoor = insertedCategories.find((c) => c.slug === "indoor-plants");
  const [tropicalSub] = await db.select().from(subCategories).where(eq(subCategories.slug, "tropical-plants")).limit(1);

  const [post] = await db
    .insert(posts)
    .values({
      authorId: author.id,
      categoryId: indoor?.id,
      subCategoryId: tropicalSub?.id ?? undefined,
      title: "Complete Monstera Deliciosa Care Guide: Light, Water, and Propagation",
      slug: "monstera-deliciosa-care-guide",
      excerpt:
        "Learn how to grow a stunning Monstera Deliciosa. From watering schedules to fenestration tips, our expert guide covers everything you need for a thriving Swiss cheese plant.",
      content: "<h2>Introduction</h2><p>Monstera Deliciosa, also known as the Swiss cheese plant...</p><h2>Light Requirements</h2><p>Place your Monstera in bright, indirect light...</p><h2>Watering</h2><p>Water when the top 2-3 inches of soil feel dry...</p>",
      featuredImageId: media.id,
      readingTimeMinutes: 8,
      status: "published",
      publishedAt: new Date(),
      viewCount: 0,
    })
    .returning();
  if (!post) throw new Error("Failed to create post");
  console.log("✓ Post created");

  // 7. SEO Metadata (Rank-Math style)
  await db.insert(seoMetadata).values({
    postId: post.id,
    focusKeyword: "monstera care",
    seoTitle: "Monstera Deliciosa Care Guide 2024 | Light, Water, Propagation",
    metaDescription:
      "Expert Monstera Deliciosa care guide. Learn watering, light, soil, and propagation. Get fenestration tips for bigger leaves. Perfect for beginners!",
    canonicalUrl: "https://growhubtips.com/indoor-plants/monstera-deliciosa-care-guide",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "Monstera Deliciosa Care Guide | GrowHubTips",
    ogDescription: "The complete guide to growing a healthy Monstera Deliciosa at home.",
    ogImage: media.url,
    twitterCardType: "summary_large_image",
    schemaJson: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Complete Monstera Deliciosa Care Guide",
        author: { "@type": "Person", name: "GrowHub Expert" },
        datePublished: new Date().toISOString(),
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Care for Monstera Deliciosa",
        step: [
          { "@type": "HowToStep", name: "Provide bright indirect light" },
          { "@type": "HowToStep", name: "Water when top soil is dry" },
          { "@type": "HowToStep", name: "Use well-draining potting mix" },
        ],
      },
    ],
    keywordDensity: 1.2,
    titleScore: 92,
    internalLinkCount: 5,
  });
  console.log("✓ SEO metadata created");

  // 8. Plant Profile (Encyclopedia)
  await db.insert(plantProfiles).values({
    postId: post.id,
    scientificName: "Monstera deliciosa",
    commonNames: ["Swiss Cheese Plant", "Split-Leaf Philodendron", "Mexican Breadfruit"],
    growthRate: "Medium to Fast",
    lifespan: "Perennial (indefinite with care)",
    lightLevel: "medium",
    wateringFrequency: "Every 1-2 weeks when top 2 inches dry",
    soilType: "Well-draining peat-based mix with perlite",
    humidityNeeds: "Moderate to High (40-60%)",
    phMin: "5.5",
    phMax: "7.0",
    isToxicToPets: true,
    toxicityDetails: "Contains calcium oxalate crystals. May cause oral irritation, vomiting if ingested.",
    hardinessZones: ["10", "11", "12"],
    heatTolerance: "Prefers 65-85°F. Avoid cold drafts.",
  });
  console.log("✓ Plant profile created");

  // 9. Link post to tags
  const beginnerTag = insertedTags.find((t) => t.slug === "beginner-friendly");
  const indoorTag = insertedTags.find((t) => t.slug === "indoor-care");
  const petTag = insertedTags.find((t) => t.slug === "pet-safe");
  if (beginnerTag && indoorTag && petTag) {
    await db.insert(postsToTags).values([
      { postId: post.id, tagId: beginnerTag.id },
      { postId: post.id, tagId: indoorTag.id },
      { postId: post.id, tagId: petTag.id },
    ]);
    console.log("✓ Post-tag links created");
  }

  // 10. Create enterprise pages (About, Contact, Privacy, Affiliate)
  const pagesData = [
    {
      slug: "about",
      title: "About GrowHubTips",
      metaDescription: "Learn about GrowHubTips and how we empower gardening enthusiasts with professional knowledge and tools",
      heroTitle: "About GrowHubTips",
      heroSubtitle: "Empowering gardeners with expert knowledge and professional tools",
      status: "published" as const,
      createdBy: user.id,
    },
    {
      slug: "contact",
      title: "Contact Us",
      metaDescription: "Get in touch with GrowHubTips for expert advice, partnerships, or general inquiries",
      heroTitle: "Contact Our Experts",
      heroSubtitle: "We're here to help with any gardening questions",
      status: "published" as const,
      createdBy: user.id,
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      metaDescription: "GrowHubTips privacy policy - Learn how we protect your data",
      heroTitle: "Privacy Policy",
      heroSubtitle: "Your trust and data privacy matter to us",
      status: "published" as const,
      createdBy: user.id,
    },
    {
      slug: "affiliate",
      title: "Affiliate Program",
      metaDescription: "Join our affiliate program and earn commissions by promoting GrowHubTips",
      heroTitle: "Grow With Us - Affiliate Program",
      heroSubtitle: "Earn attractive commissions by partnering with GrowHubTips",
      status: "published" as const,
      createdBy: user.id,
    },
  ];

  const createdPages = await db.insert(pageContent).values(pagesData).returning();
  console.log(`✓ ${createdPages.length} enterprise pages created`);

  // 11. Add timeline events for About page
  const aboutPage = createdPages.find((p) => p.slug === "about");
  if (aboutPage) {
    await db.insert(timelineEvents).values([
      {
        pageId: aboutPage.id,
        year: 2020,
        month: 3,
        title: "GrowHubTips Founded",
        description: "Started with a mission to make gardening accessible to everyone",
        icon: "sprout",
        sortOrder: 1,
      },
      {
        pageId: aboutPage.id,
        year: 2021,
        month: 6,
        title: "Community Reaches 10K Members",
        description: "Our community of gardening enthusiasts surpassed 10,000 members",
        icon: "users",
        sortOrder: 2,
      },
      {
        pageId: aboutPage.id,
        year: 2022,
        month: 9,
        title: "Plant Clinic Launched",
        description: "Launched dedicated plant health diagnosis and expert consultation service",
        icon: "heart-handshake",
        sortOrder: 3,
      },
      {
        pageId: aboutPage.id,
        year: 2023,
        month: 12,
        title: "Premium Courses Released",
        description: "Released comprehensive gardening courses with expert certifications",
        icon: "book-open",
        sortOrder: 4,
      },
      {
        pageId: aboutPage.id,
        year: 2024,
        month: 6,
        title: "50K+ Active Users",
        description: "Celebrating 50,000+ active users helping each other grow",
        icon: "trophy",
        sortOrder: 5,
      },
    ]);
    console.log("✓ Timeline events created");

    // Add team members
    await db.insert(teamMembers).values([
      {
        pageId: aboutPage.id,
        name: "Sarah Chen",
        role: "Founder & CEO",
        bio: "Certified horticulturist with 15+ years of experience in urban gardening",
        credentials: "MS Horticulture, Royal Horticultural Society Member",
        expertise: ["Urban Gardening", "Sustainable Agriculture", "Plant Health"],
        sortOrder: 1,
        authorId: author.id,
      },
      {
        pageId: aboutPage.id,
        name: "David Rodriguez",
        role: "Head of Plant Science",
        bio: "PhD in Plant Physiology with focus on indoor cultivation techniques",
        credentials: "PhD Plant Physiology, Published Researcher",
        expertise: ["Plant Physiology", "Indoor Gardening", "Hydroponics"],
        sortOrder: 2,
      },
      {
        pageId: aboutPage.id,
        name: "Emma Wilson",
        role: "Community Manager",
        bio: "Passionate about connecting gardeners and sharing best practices",
        credentials: "BS Botany, Community Leadership Certification",
        expertise: ["Community Building", "Garden Design", "Sustainability"],
        sortOrder: 3,
      },
    ]);
    console.log("✓ Team members created");
  }

  // 12. Add office hours for Contact page
  const contactPage = createdPages.find((p) => p.slug === "contact");
  if (contactPage) {
    await db.insert(officeHours).values([
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isOpen: true, timezone: "UTC" },
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isOpen: true, timezone: "UTC" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isOpen: true, timezone: "UTC" },
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isOpen: true, timezone: "UTC" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isOpen: true, timezone: "UTC" },
      { dayOfWeek: 6, startTime: "10:00", endTime: "15:00", isOpen: true, timezone: "UTC" },
      { dayOfWeek: 7, startTime: "00:00", endTime: "00:00", isOpen: false, timezone: "UTC" },
    ]);
    console.log("✓ Office hours created");

    // Add FAQ items
    await db.insert(faqItems).values([
      {
        pageId: contactPage.id,
        question: "How long does it take to get a response?",
        answer: "We typically respond within 24-48 hours during business days. For urgent matters, please indicate priority in your message.",
        category: "Support",
        sortOrder: 1,
      },
      {
        pageId: contactPage.id,
        question: "Do you offer plant consultations?",
        answer: "Yes! Our expert team offers personalized plant consultations. Use our Plant Clinic service or contact us directly for scheduling.",
        category: "Services",
        sortOrder: 2,
      },
      {
        pageId: contactPage.id,
        question: "Can I schedule a video consultation?",
        answer: "Absolutely! We offer video consultations for plant health assessments and personalized gardening advice. Contact us to book a session.",
        category: "Services",
        sortOrder: 3,
      },
      {
        pageId: contactPage.id,
        question: "What's the best way to reach you?",
        answer: "You can reach us through this contact form, email, or our Plant Clinic service. For faster response, email is preferred during office hours.",
        category: "Support",
        sortOrder: 4,
      },
    ]);
    console.log("✓ FAQ items created");
  }

  console.log("\n✅ Seed completed successfully!");
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
