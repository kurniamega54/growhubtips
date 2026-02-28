"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitContactForm, checkClinicAvailability } from "@/app/admin/server-actions/pages";
import { contactFormSchema } from "@/lib/validations/pages";
import type { ContactPageData } from "@/lib/types/pages";
import {
  fadeInVariants,
  staggerContainerVariants,
  slideInLeftVariants,
  slideInRightVariants,
  getDayName,
  formatTime,
  getNextOpeningTime,
} from "@/lib/utils/page-utils";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  MapPinIcon,
} from "lucide-react";

interface ContactPageContentProps {
  pageData: ContactPageData;
}

export default function ContactPageContent({ pageData }: ContactPageContentProps) {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [clinicAvailable, setClinicAvailable] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: "general" as const,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkAvailability = async () => {
    startTransition(async () => {
      const result = await checkClinicAvailability();
      if (result.success && result.data) {
        setClinicAvailable(result.data.available);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "", type: "general" });
        setStep(1);
      } else {
        setError(result.message);
      }
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "info@growhubtips.com",
      link: "mailto:info@growhubtips.com",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+966 50 XXXX XXXX",
      link: "tel:+966500000000",
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Riyadh, Saudi Arabia",
      link: "#",
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
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-forest mb-6"
          >
            {pageData.heroTitle || "Get in Touch"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto"
          >
            {pageData.heroSubtitle ||
              "We're here to help you. Whether you have a general question or need expert consultation, our team is ready to assist"}
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Information Cards */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="py-20 px-4 md:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={idx}
                  href={info.link}
                  variants={slideInLeftVariants}
                  className="group bg-white rounded-[2rem_1rem_3rem_1.5rem] p-8 shadow-soft hover:shadow-lg transition-all border border-primary-500/20"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-primary-500/20 rounded-full flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                      <Icon className="text-primary-500 group-hover:text-white transition-colors" size={24} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-forest mb-2">{info.title}</h3>
                  <p className="text-gray-700 group-hover:text-primary-600 transition-colors">{info.content}</p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Multi-Step Form & Office Hours */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="py-20 px-4 md:px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div variants={slideInLeftVariants} className="md:col-span-2">
              <div className="bg-gradient-to-br from-white to-soft-green/20 rounded-[2rem_1rem_3rem_1.5rem] p-10 shadow-soft border border-primary-500/20">
                <h2 className="text-3xl font-bold text-forest mb-8">Consultation Form</h2>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center"
                    >
                      <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-green-600 mb-2">Sent Successfully!</h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for contacting us. We'll respond to your inquiry as soon as possible.
                      </p>
                      <button
                        onClick={() => setSuccess(false)}
                        className="px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition"
                      >
                        Send Another Inquiry
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {/* Step Indicator */}
                      <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                          <motion.div
                            key={s}
                            className={`flex-1 h-2 rounded-full transition-colors ${
                              s <= step ? "bg-primary-500" : "bg-gray-300"
                            }`}
                            layoutId={`step-${s}`}
                          />
                        ))}
                      </div>

                      {/* Step 1: Personal Info */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              placeholder="John Doe"
                              className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-0 transition"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Your Email *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              placeholder="you@example.com"
                              className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-0 transition"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Inquiry Type *
                            </label>
                            <select
                              name="type"
                              value={formData.type}
                              onChange={handleInputChange}
                              className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-0 transition"
                            >
                              <option value="general">General Inquiry</option>
                              <option value="clinic">Plant Clinic Booking</option>
                              <option value="expert">Expert Consultation Request</option>
                            </select>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Message */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Subject *
                            </label>
                            <input
                              type="text"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              required
                              placeholder="A short and clear subject"
                              className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-0 transition"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Detailed Message *
                            </label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              required
                              rows={5}
                              placeholder="Explain your issue or inquiry in detail..."
                              className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-0 transition resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              {formData.message.length}/5000 characters
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Review */}
                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Phone Number (Optional)
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+966 50 XXXX XXXX"
                              className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-0 transition"
                            />
                          </div>

                          <div className="bg-primary-500/10 border-l-4 border-primary-500 p-5 rounded">
                            <h4 className="font-bold text-forest mb-3">Inquiry Information Summary:</h4>
                            <div className="space-y-2 text-sm text-gray-700">
                              <p>
                                <span className="font-semibold">Name:</span> {formData.name}
                              </p>
                              <p>
                                <span className="font-semibold">Email:</span> {formData.email}
                              </p>
                              <p>
                                <span className="font-semibold">Type:</span> {formData.type}
                              </p>
                              <p>
                                <span className="font-semibold">Subject:</span> {formData.subject}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3 p-4 bg-red-50 border border-red-300 rounded-lg"
                        >
                          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                          <p className="text-red-700">{error}</p>
                        </motion.div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex gap-4 pt-6">
                        {step > 1 && (
                          <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                            disabled={isPending}
                          >
                            Previous
                          </button>
                        )}

                        {step < 3 && (
                          <button
                            type="button"
                            onClick={() => setStep(step + 1)}
                            className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-semibold disabled:opacity-50"
                            disabled={isPending || !formData.name || !formData.email}
                          >
                            Next
                          </button>
                        )}

                        {step === 3 && (
                          <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50"
                            disabled={isPending}
                          >
                            {isPending ? "Sending..." : "Send"}
                          </button>
                        )}
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Office Hours & Services */}
            <motion.div variants={slideInRightVariants} className="space-y-8">
              {/* Office Hours */}
              <div className="bg-white rounded-[2rem_1rem_3rem_1.5rem] p-8 shadow-soft border border-sage/30">
                <h3 className="text-2xl font-bold text-forest mb-6 flex items-center gap-2">
                  <Clock size={24} className="text-sage" />
                  Office Hours
                </h3>

                {pageData.officeHours && pageData.officeHours.length > 0 ? (
                  <div className="space-y-4">
                    {pageData.officeHours.map((hours, idx) => (
                      <div
                        key={idx}
                        className="pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">
                            {getDayName(hours.dayOfWeek)}
                          </span>
                          {hours.isOpen && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              Open
                            </span>
                          )}
                        </div>
                        {hours.isOpen && (
                          <p className="text-sm text-gray-600 mt-2">
                            {formatTime(hours.startTime)} - {formatTime(hours.endTime)}
                          </p>
                        )}
                        {!hours.isOpen && (
                          <p className="text-sm text-gray-500 mt-2">Closed</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No office hours information available</p>
                )}
              </div>

              {/* Clinic Availability */}
              <button
                onClick={checkAvailability}
                disabled={isPending}
                className="w-full bg-primary-500 text-white rounded-[1.5rem_2rem_1rem_2.5rem] p-8 hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <MapPinIcon size={24} />
                  <h3 className="text-xl font-bold">Plant Clinic</h3>
                </div>
                <p className="text-sm text-white/90 mb-4">
                  Check appointment availability now
                </p>
                <div className="text-sm font-semibold">
                  {clinicAvailable ? "✓ Booking Available" : isPending ? "Checking..." : "Check Availability"}
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      {pageData.faqItems && pageData.faqItems.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInVariants}
          className="py-20 px-4 md:px-6"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-forest mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {pageData.faqItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[1.5rem_2rem_1rem_2.5rem] overflow-hidden shadow-soft hover:shadow-lg transition-shadow border border-primary-500/10"
                >
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === item.id ? null : item.id)
                    }
                    className="w-full p-6 text-right flex items-center justify-between gap-4 hover:bg-soft-green/20 transition"
                  >
                    <span className="text-lg font-semibold text-forest">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={24}
                      className={`flex-shrink-0 text-primary-500 transition-transform ${
                        expandedFAQ === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedFAQ === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 pt-2 border-t border-gray-200"
                      >
                        <p className="text-gray-700 leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
