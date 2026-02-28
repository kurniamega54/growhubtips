import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getContactPageData } from "@/lib/queries.pages";
import { generateContactPageSchema, generateBreadcrumbSchema } from "@/lib/utils/page-utils";
import { Suspense } from "react";

const ContactPageContent = dynamic(() => import("./_components/ContactPageContent"), {
  loading: () => <div className="min-h-screen animate-pulse bg-soft-green" />,
});

export const metadata: Metadata = {
  title: "Contact GrowHubTips | Expert Gardening Consultations",
  description:
    "Get in touch with our expert team for gardening inquiries and plant care advice. We respond quickly to your questions",
  openGraph: {
    title: "Contact GrowHubTips",
    description: "Get direct consultations from gardening experts",
    type: "website",
    locale: "en_US",
  },
};

export default async function ContactPage() {
  const pageData = await getContactPageData();

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

  const contactSchema = generateContactPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://growhubtips.com" },
    { name: "Contact Us", url: "https://growhubtips.com/contact" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-soft-green" />}>
        <ContactPageContent pageData={pageData} />
      </Suspense>
    </>
  );
}
