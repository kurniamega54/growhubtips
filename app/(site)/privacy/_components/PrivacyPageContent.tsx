"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PageContentData } from "@/lib/types/pages";
import { fadeInVariants, staggerContainerVariants, slideInLeftVariants } from "@/lib/utils/page-utils";
import { ContentRenderer } from "@/app/components/ContentRenderer";
import { ChevronRight, Shield, Lock, Eye, Trash2 } from "lucide-react";

interface PrivacyPageContentProps {
  pageData: PageContentData;
}

const privacySections = [
  {
    id: "intro",
    title: "Introduction",
    plainEnglish:
      "We know your privacy matters. This policy explains in simple terms how we collect and use visitor data.",
    legalText:
      "In accordance with international data protection laws, we maintain the highest standards for protecting personal information of our website users.",
    icon: Shield,
  },
  {
    id: "data-collection",
    title: "Information We Collect",
    plainEnglish:
      "We collect the following information: your name, email address, phone number (optional), and any other information you voluntarily share with us.",
    legalText:
      "Personal data is collected through contact forms, newsletter subscriptions, and authorized tracking cookies. All data collection complies with GDPR and equivalent regulations.",
    icon: Eye,
  },
  {
    id: "data-usage",
    title: "How We Use Your Data",
    plainEnglish:
      "We use your data to: respond to your inquiries, send gardening tips, improve our services, and tailor content to your interests.",
    legalText:
      "Legal basis for processing includes explicit consent for marketing, contractual obligations, legal requirements, and legitimate interests.",
    icon: Lock,
  },
  {
    id: "data-protection",
    title: "Data Security",
    plainEnglish:
      "We protect your data with strong encryption and advanced security systems. Our team continuously monitors to prevent breaches.",
    legalText:
      "Security measures include: SSL/TLS encryption, access controls, regular backups, and periodic security testing.",
    icon: Lock,
  },
  {
    id: "user-rights",
    title: "Your Rights",
    plainEnglish:
      "You have the right to: access your data, correct inaccurate information, request deletion, and withdraw consent at any time.",
    legalText:
      "Under GDPR and equivalent laws, you have rights to: access, rectification, erasure (right to be forgotten), data portability, and objection.",
    icon: Trash2,
  },
  {
    id: "contact",
    title: "Contact Us",
    plainEnglish:
      "If you have questions or concerns about your privacy, please don't hesitate to contact us directly.",
    legalText:
      "For data protection inquiries and policy updates, please contact our Data Protection Officer: privacy@growhubtips.com",
    icon: Shield,
  },
];

export default function PrivacyPageContent({ pageData }: PrivacyPageContentProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("intro");
  const [showLegalText, setShowLegalText] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-soft-green/30 to-white">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
        className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-[3rem_1rem_4rem_2rem] blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-forest mb-6"
          >
            Privacy & Data Protection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto"
          >
            We are committed to protecting your privacy and personal data with the highest standards. This page is transparent and easy to understand.
          </motion.p>
          {/* Render rich content from CMS */}
          {pageData.content && (
            <div className="mt-8 text-left">
              <ContentRenderer content={pageData.content as any} />
            </div>
          )}
        </div>
      </motion.section>

      {/* Trust Indicators */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="py-16 px-4 md:px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "SSL Certified", desc: "Military-grade encryption" },
              { icon: Lock, title: "GDPR Compliant", desc: "International privacy laws" },
              { icon: Eye, title: "Full Transparency", desc: "No hidden surprises" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-6"
                >
                  <Icon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-bold text-forest mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Main Content - Two Column Layout */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Side Navigation */}
          <motion.div variants={slideInLeftVariants} className="md:col-span-1">
            <div className="sticky top-8 space-y-2">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Jump to Section</h3>
              {privacySections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setExpandedSection(section.id)}
                  className={`w-full text-right px-4 py-3 rounded-lg transition border-r-4 ${
                    expandedSection === section.id
                      ? "bg-primary-500/20 border-r-primary-500 text-primary-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 border-r-transparent"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={fadeInVariants} className="md:col-span-3">
            <div className="space-y-6">
              {privacySections.map((section) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.id}
                    layout
                    className="bg-white rounded-[2rem_1rem_3rem_1.5rem] border border-primary-500/20 overflow-hidden shadow-soft"
                  >
                    {/* Section Header */}
                    <button
                      onClick={() =>
                        setExpandedSection(
                          expandedSection === section.id ? null : section.id
                        )
                      }
                      className="w-full p-8 text-right flex items-center justify-between gap-4 hover:bg-soft-green/20 transition"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Icon className="w-6 h-6 text-primary-500 flex-shrink-0" />
                        <h3 className="text-2xl font-bold text-forest">{section.title}</h3>
                      </div>
                      <ChevronRight
                        size={24}
                        className={`flex-shrink-0 text-primary-500 transition-transform ${
                          expandedSection === section.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Section Content */}
                    <AnimatePresence>
                      {expandedSection === section.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200"
                        >
                          <div className="p-8 space-y-6">
                            {/* Plain English Section */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-sage" />
                                <h4 className="text-sm font-bold text-sage uppercase">
                                  In Simple Language
                                </h4>
                              </div>
                              <p className="text-gray-700 leading-relaxed text-lg">
                                {section.plainEnglish}
                              </p>
                            </div>

                            {/* Toggle Legal Text */}
                            <button
                              onClick={() => setShowLegalText(!showLegalText)}
                              className="text-primary-500 hover:text-primary-600 text-sm font-semibold flex items-center gap-2"
                            >
                              {showLegalText ? "Hide" : "Show"} Legal Text
                              <ChevronRight
                                size={16}
                                className={`transition-transform ${
                                  showLegalText ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {/* Legal Text */}
                            {showLegalText && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                                  <h4 className="text-sm font-bold text-gray-600 uppercase">
                                    Legal Text
                                  </h4>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm font-mono">
                                  {section.legalText}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 p-6 bg-primary-500/10 rounded-lg border border-primary-500/20 text-center"
            >
              <p className="text-sm text-gray-600">
                Last Updated: February 2026
                <br />
                <span className="text-xs text-gray-500">This policy may change at any time</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
