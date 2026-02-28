import { z } from "zod";

// Contact Form Validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(255, { message: "Name is too long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" }),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\+\()]+$/.test(val),
      { message: "Invalid phone number" }
    ),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" })
    .max(255, { message: "Subject is too long" }),
  message: z
    .string()
    .min(20, { message: "Message must be at least 20 characters" })
    .max(5000, { message: "Message is too long" }),
  type: z
    .enum(["general", "clinic", "expert"], { message: "Invalid inquiry type" })
    .optional()
    .default("general"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// Multi-step form validation
export const contactFormStep1Schema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(255),
  email: z.string().email({ message: "Invalid email address" }),
  type: z.enum(["general", "clinic", "expert"]).optional().default("general"),
});

export const contactFormStep2Schema = z.object({
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" })
    .max(255),
  message: z
    .string()
    .min(20, { message: "Message must be at least 20 characters" })
    .max(5000),
});

export const contactFormStep3Schema = z.object({
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\+\()]+$/.test(val),
      { message: "Invalid phone number" }
    ),
});

export type ContactFormStep1 = z.infer<typeof contactFormStep1Schema>;
export type ContactFormStep2 = z.infer<typeof contactFormStep2Schema>;
export type ContactFormStep3 = z.infer<typeof contactFormStep3Schema>;

// Newsletter subscription
export const newsletterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
