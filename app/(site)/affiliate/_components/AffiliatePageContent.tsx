"use client";

import { motion } from "framer-motion";
import { Check, TrendingUp, Zap, Users, Award, DollarSign } from "lucide-react";
import type { PageContentData } from "@/lib/types/pages";
import {
  fadeInVariants,
  staggerContainerVariants,
  slideInLeftVariants,
  slideInRightVariants,
  scaleInVariants,
} from "@/lib/utils/page-utils";

interface AffiliatePageContentProps {
  pageData: PageContentData;
}

export default function AffiliatePageContent({ pageData }: AffiliatePageContentProps) {
  const benefits = [
    {
      icon: DollarSign,
      title: "Attractive Commissions",
      description: "Earn 15%-25% on every sale through your affiliate link",
    },
    {
      icon: Zap,
      title: "Easy to Use",
      description: "Simple and easy dashboard to track your earnings and affiliate links",
    },
    {
      icon: TrendingUp,
      title: "Continuous Support",
      description: "Our team helps you choose the best ways to market products",
    },
    {
      icon: Users,
      title: "Active Community",
      description: "Join thousands of successful partners in our program",
    },
    {
      icon: Award,
      title: "Bonus Rewards",
      description: "Earn rewards when reaching specific performance goals",
    },
    {
      icon: Check,
      title: "Complete Transparency",
      description: "Fair treatment and fast, regular payments",
    },
  ];

  const stats = [
    { number: "5000+", label: "Active Partners" },
    { number: "$2M+", label: "Annual Earnings" },
    { number: "30", label: "Day Cookie Duration" },
    { number: "98%", label: "Partner Satisfaction" },
  ];

  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description: "Join our program easily and share your basic information",
    },
    {
      number: "2",
      title: "Get Your Links",
      description: "Copy your unique links and share them with your audience",
    },
    {
      number: "3",
      title: "Track Earnings",
      description: "See your purchases and earnings in real-time",
    },
    {
      number: "4",
      title: "Get Paid",
      description: "Earn your profits every month without delay",
    },
  ];

  const faqs = [
    {
      q: "When will I receive my first commission?",
      a: "After your first successful sale through your link. Commission is paid at the end of the following month.",
    },
    {
      q: "What is the minimum withdrawal amount?",
      a: "The minimum withdrawal is $20. You can withdraw monthly if you reach the minimum.",
    },
    {
      q: "Can I promote specific products?",
      a: "Yes! Choose the products you want to promote. No restricted products.",
    },
    {
      q: "How long is the affiliate link valid?",
      a: "30 days. If the customer makes a purchase within 30 days of clicking, you get the commission.",
    },
    {
      q: "What if the customer doesn't complete the purchase?",
      a: "If they don't complete the purchase within 30 days, you don't earn a commission.",
    },
    {
      q: "Do I need a website?",
      a: "No! You can also promote through social media and email.",
    },
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

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-forest mb-6"
          >
            Affiliate Partnership Program
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8"
          >
            Earn real money by marketing trusted gardening products. No prior experience required.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-primary-500 text-white font-bold rounded-full hover:bg-primary-600 transition"
          >
            Join Now
          </motion.button>
        </div>
      </motion.section>

      {/* Statistics */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="py-20 px-4 md:px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={scaleInVariants}
                custom={idx}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary-500 mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="py-20 md:py-24 px-4 md:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeInVariants}
            className="text-4xl font-bold text-forest mb-16 text-center"
          >
            Why Choose Our Program?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  variants={slideInLeftVariants}
                  custom={idx}
                  className="bg-white rounded-[2rem_1rem_3rem_1.5rem] p-8 shadow-soft hover:shadow-lg transition-shadow border border-primary-500/20"
                >
                  <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
                    <Icon className="text-primary-500" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-forest mb-3">{benefit.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
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
            How to Get Started
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-sage to-secondary-400" />

            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={slideInLeftVariants}
                custom={idx}
                className="relative"
              >
                <div className="bg-white rounded-[1.5rem_2rem_1rem_2.5rem] p-8 shadow-soft hover:shadow-lg transition-shadow border border-primary-500/20 relative z-10">
                  <div className="absolute -top-6 right-6 w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                    {step.number}
                  </div>

                  <h3 className="text-xl font-bold text-forest mb-3 mt-6">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
        className="py-20 md:py-24 px-4 md:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-forest mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.details
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white rounded-[1.5rem_2rem_1rem_2.5rem] shader-soft border border-primary-500/20 overflow-hidden cursor-pointer"
              >
                <motion.summary className="p-6 text-right flex items-center justify-between gap-4 hover:bg-soft-green/20 transition selection:bg-primary-500/20">
                  <span className="text-lg font-semibold text-forest">{faq.q}</span>
                  <span className="text-2xl text-primary-500 transition group-open:rotate-180">
                    +
                  </span>
                </motion.summary>

                <motion.div className="px-6 pb-6 pt-2 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                </motion.div>
              </motion.details>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Earning Journey Today
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            No registration fees. No commitments. Join now and start earning from day one.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 bg-white text-primary-500 font-bold rounded-full hover:bg-gray-100 transition"
            >
              Join the Program
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition"
            >
              Learn More
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Trust Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="py-16 px-4 md:px-6 bg-white border-t border-gray-200"
      >
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 mb-8">Trusted by thousands of partners worldwide</p>
          <div className="flex justify-center gap-8 flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse"
              />
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
