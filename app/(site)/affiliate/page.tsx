import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getAffiliatePageData } from "@/lib/queries.pages";
import { generateBreadcrumbSchema } from "@/lib/utils/page-utils";
import { Suspense } from "react";

const AffiliatePageContent = dynamic(() => import("./_components/AffiliatePageContent"), {
  loading: () => <div className="min-h-screen animate-pulse bg-soft-green" />,
});

export const metadata: Metadata = {
  title: "Join Our Affiliate Program | GrowHubTips",
  description:
    "Earn commissions by promoting GrowHubTips to gardening enthusiasts. Generous payouts, 30-day cookies, and full support",
  openGraph: {
    title: "Affiliate Program - GrowHubTips",
    description: "Partner with us and earn competitive commissions",
    type: "website",
    locale: "en_US",
  },
};

export default async function AffiliatePage() {
  const pageData = await getAffiliatePageData();

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
    { name: "Affiliate Program", url: "https://growhubtips.com/affiliate" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-soft-green" />}>
        <AffiliatePageContent pageData={pageData} />
      </Suspense>
    </>
  );
}
