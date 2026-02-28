import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getPrivacyPageData } from "@/lib/queries.pages";
import { generateBreadcrumbSchema } from "@/lib/utils/page-utils";
import { Suspense } from "react";

const PrivacyPageContent = dynamic(() => import("./_components/PrivacyPageContent"), {
  loading: () => <div className="min-h-screen animate-pulse bg-soft-green" />,
});

export const metadata: Metadata = {
  title: "Privacy & Data Protection | GrowHubTips",
  description:
    "Learn about how GrowHubTips protects your personal information and privacy. Transparent policies in plain English",
  openGraph: {
    title: "Privacy & Data Protection",
    description: "We protect your data with the highest standards",
    type: "website",
    locale: "en_US",
  },
};

export default async function PrivacyPage() {
  const pageData = await getPrivacyPageData();

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

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://growhubtips.com" },
    { name: "Privacy & Data Protection", url: "https://growhubtips.com/privacy" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-soft-green" />}>
        <PrivacyPageContent pageData={pageData} />
      </Suspense>
    </>
  );
}
