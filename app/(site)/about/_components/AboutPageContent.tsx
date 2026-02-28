"use client";

import { motion } from "framer-motion";
import { ChevronRight, Leaf, Users, Award, TrendingUp } from "lucide-react";
import type { AboutPageData } from "@/lib/types/pages";
import {
  fadeInVariants,
  staggerContainerVariants,
  slideInLeftVariants,
  slideInRightVariants,
  scaleInVariants,
  getDayName,
} from "@/lib/utils/page-utils";
import { ContentRenderer } from "@/app/components/ContentRenderer";

interface AboutPageContentProps {
  pageData: AboutPageData;
}

export default function AboutPageContent({ pageData }: AboutPageContentProps) {
  const stats = [
    { label: "Articles Published", value: "500+", icon: Leaf },
    { label: "Monthly Readers", value: "50K+", icon: Users },
    { label: "Expert Contributors", value: "25+", icon: Award },
    { label: "Years of Experience", value: "5+", icon: TrendingUp },
  ];

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
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-400 rounded-[2rem_3rem_1rem_4rem] blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-forest mb-6 text-right"
          >
            {pageData.heroTitle || "About GrowHubTips"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-700 leading-relaxed text-right max-w-3xl mx-auto"
          >
            {pageData.heroSubtitle ||
              "We believe gardening is both an art and a science. Our mission is to empower gardening enthusiasts with advanced knowledge and practical tools to turn their dreams into green reality"}
          </motion.p>
          {/* Render rich page content from CMS if available */}
          {pageData.content && (
            <div className="mt-8 text-right">
              <ContentRenderer content={pageData.content as any} />
            </div>
          )}
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="py-20 md:py-24 px-4 md:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              variants={slideInLeftVariants}
              className="bg-white border-2 border-primary-500 border-opacity-20 rounded-[2rem_1rem_3rem_1.5rem] p-10 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <Leaf className="text-primary-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-forest">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Providing reliable and practical content that empowers everyone to grow their plants successfully, regardless of their prior experience. We strive to make gardening accessible and easy to understand for everyone.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              variants={slideInRightVariants}
              className="bg-white border-2 border-sage/30 rounded-[1rem_2.5rem_1.5rem_3rem] p-10 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="text-sage" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-forest">Our Vision</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A global community of gardening enthusiasts collaborating and sharing experiences, achieving environmental sustainability and self-sufficiency in every home.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="py-20 md:py-24 px-4 md:px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeInVariants}
            className="text-4xl font-bold text-forest mb-16 text-center"
          >
            Our Impact in Numbers
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={scaleInVariants}
                  custom={idx}
                  className="text-center p-8 rounded-[2rem_1rem_2.5rem_1rem] bg-gradient-to-br from-soft-green to-white border border-primary-500/20 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <Icon className="text-primary-500" size={32} />
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-forest mb-2">{stat.value}</p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      {pageData.timeline && pageData.timeline.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="py-20 md:py-24 px-4 md:px-6"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2
              variants={fadeInVariants}
              className="text-4xl font-bold text-forest mb-16 text-center"
            >
              Our Journey Through Time
            </motion.h2>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute right-1/2 transform translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-sage to-secondary-400" />

              <div className="space-y-12">
                {pageData.timeline.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    variants={idx % 2 === 0 ? slideInLeftVariants : slideInRightVariants}
                    className={`flex gap-8 ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                  >
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-16 h-16 rounded-full bg-white border-4 border-primary-500 flex items-center justify-center text-2xl shadow-lg z-10 flex-shrink-0"
                      >
                        {event.icon || "🌿"}
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <div className="bg-white rounded-[1.5rem_2rem_1rem_2.5rem] p-8 shadow-soft border border-primary-500/10 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-3xl font-bold text-primary-500">{event.year}</span>
                          {event.month && (
                            <span className="text-sm text-gray-600">
                              {getDayName(event.month - 1)}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-forest mb-2">{event.title}</h3>
                        {event.description && (
                          <p className="text-gray-700 leading-relaxed">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Team Section */}
      {pageData.team && pageData.team.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="py-20 md:py-24 px-4 md:px-6 bg-soft-green/20"
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2
              variants={fadeInVariants}
              className="text-4xl font-bold text-forest mb-16 text-center"
            >
              Our Expert Team
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageData.team.map((member, idx) => (
                <motion.div
                  key={member.id}
                  variants={scaleInVariants}
                  custom={idx}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-[2.5rem_1rem_2rem_1.5rem] bg-white shadow-soft hover:shadow-lg transition-shadow h-full flex flex-col">
                    {/* Image */}
                    {member.imageUrl && (
                      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary-500/20 to-sage/20">
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-forest mb-1">{member.name}</h3>
                      <p className="text-primary-500 font-semibold mb-4">{member.role}</p>

                      {member.bio && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                          {member.bio}
                        </p>
                      )}

                      {member.expertise && member.expertise.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase">
                            Expertise
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {member.expertise.map((exp) => (
                              <span
                                key={exp}
                                className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 text-xs font-medium"
                              >
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Social Links */}
                      {member.socialLinks && Object.keys(member.socialLinks).length > 0 && (
                        <div className="mt-6 flex gap-3">
                          {Object.entries(member.socialLinks).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-primary-500/10 hover:bg-primary-500 text-primary-600 hover:text-white flex items-center justify-center transition-colors"
                              title={platform}
                            >
                              <ChevronRight size={18} className="rotate-180" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Values Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="py-20 md:py-24 px-4 md:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeInVariants}
            className="text-4xl font-bold text-forest mb-12 text-center"
          >
            Our Core Values
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Transparency and Reliability",
                description:
                  "All information we provide is verified by trusted experts and based on scientific research",
              },
              {
                title: "Environmental Sustainability",
                description:
                  "We always choose eco-friendly solutions that preserve our green planet",
              },
              {
                title: "Easy to Understand",
                description:
                  "We explain complex concepts simply and clearly for all levels",
              },
              {
                title: "Community and Collaboration",
                description:
                  "We believe in the power of community and sharing experiences between gardeners and researchers",
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                variants={slideInLeftVariants}
                className="bg-gradient-to-br from-white to-soft-green/20 rounded-[1.5rem_2rem_1rem_2.5rem] p-8 border border-primary-500/20 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-forest mb-3">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
        className="py-20 md:py-24 px-4 md:px-6 bg-primary-500 text-white overflow-hidden relative"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-[3rem_1rem_4rem_2rem] blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Get exclusive tips and advanced guidance from our experts directly in your email
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-primary-500 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Subscribe Now
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}
