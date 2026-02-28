import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getAboutPageData } from "@/lib/queries.pages";
import { generateOrganizationSchema, generateBreadcrumbSchema } from "@/lib/utils/page-utils";
import { Suspense } from "react";

const AboutPageContent = dynamic(() => import("./_components/AboutPageContent"), {
  loading: () => <div className="min-h-screen animate-pulse bg-soft-green" />,
});

export const metadata: Metadata = {
  title: "About GrowHubTips | Comprehensive Gardening Platform",
  description:
    "Learn about GrowHubTips and how we empower gardening enthusiasts with professional knowledge and tools",
  openGraph: {
    title: "About GrowHubTips",
    description:
      "Discover our journey and specialized team dedicated to home gardening and cultivation",
    type: "website",
    locale: "en_US",
  },
};

export default async function AboutPage() {
  const pageData = await getAboutPageData();

  if (!pageData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-forest mb-2">Failed to Load Page</h1>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://growhubtips.com" },
    { name: "About GrowHubTips", url: "https://growhubtips.com/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-soft-green" />}>
        <AboutPageContent pageData={pageData} />
      </Suspense>
    </>
  );
}
