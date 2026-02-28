"use client";

/**
 * Admin Registration Page - Create first admin account
 * Only accessible if no admin exists
 */

import { useState } from "react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, User, Mail, Loader2, Check } from "lucide-react";
import { registerAdminSchema, type RegisterAdminInput } from "@/lib/validations/auth";
import { registerAdminAction } from "../auth-actions";
import { AuthRedirect } from "../components/AuthRedirect";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction] = useActionState(
    async (prev: unknown, formData: FormData) => {
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");
      return await registerAdminAction({ name, email, password, confirmPassword });
    },
    null as any
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
  } = useForm<RegisterAdminInput>({
    resolver: zodResolver(registerAdminSchema),
  });

  const password = watch("password");

  const passwordStrength = {
    hasUppercase: /[A-Z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
    hasSpecial: /[!@#$%^&*]/.test(password || ""),
    isLongEnough: (password || "").length >= 8,
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">
      {/* LEFT SIDE - FOREST BACKGROUND */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2D5A27] via-[#3D7A37] to-[#1F4620] relative overflow-hidden flex-col items-center justify-center p-12"
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-900/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-800/20 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 mb-8">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Create Your Admin</h1>
          <p className="text-xl text-green-50 mb-8">
            Set up your administrator account to begin managing GrowHubTips content
          </p>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE - REGISTRATION FORM */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 bg-[#F9F9F9] overflow-y-auto"
      >
        <div className="w-full max-w-sm">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-[#2D5A27] mb-2">Create Admin Account</h2>
            <p className="text-neutral-600 text-sm">Only one admin account is allowed</p>
          </motion.div>

          {/* Error Alert */}
          {state?.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {state.error}
            </motion.div>
          )}

          {/* Success Alert */}
          {state?.success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-3"
            >
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Account created successfully!</p>
                <p className="text-xs mt-1">Redirecting to dashboard...</p>
              </div>
            </motion.div>
          )}

          {/* Registration Form */}
          <form action={formAction} className="space-y-4">
            {/* Name Field */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Your name"
                  className={`w-full pl-12 pr-4 py-2.5 border-2 rounded-lg transition focus:outline-none text-sm ${
                    errors.name
                      ? "border-red-300 bg-red-50/30"
                      : "border-neutral-200 bg-white focus:border-[#2D5A27]"
                  }`}
                />
              </div>
              {errors.name && <span className="text-xs text-red-600 mt-1 block">{errors.name.message}</span>}
            </motion.div>

            {/* Email Field */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="admin@growtips.com"
                  className={`w-full pl-12 pr-4 py-2.5 border-2 rounded-lg transition focus:outline-none text-sm ${
                    errors.email
                      ? "border-red-300 bg-red-50/30"
                      : "border-neutral-200 bg-white focus:border-[#2D5A27]"
                  }`}
                />
              </div>
              {errors.email && <span className="text-xs text-red-600 mt-1 block">{errors.email.message}</span>}
            </motion.div>

            {/* Password Field */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                  className={`w-full pl-12 pr-4 py-2.5 border-2 rounded-lg transition focus:outline-none text-sm ${
                    errors.password
                      ? "border-red-300 bg-red-50/30"
                      : "border-neutral-200 bg-white focus:border-[#2D5A27]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 space-y-1.5">
                  <div className="text-xs font-medium text-neutral-600">Password Strength:</div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        strengthScore === 4
                          ? "bg-green-500"
                          : strengthScore === 3
                          ? "bg-yellow-500"
                          : strengthScore === 2
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(strengthScore / 4) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className={passwordStrength.isLongEnough ? "text-green-600" : "text-neutral-500"}>
                      {passwordStrength.isLongEnough ? "✓" : "•"} At least 8 characters
                    </div>
                    <div className={passwordStrength.hasUppercase ? "text-green-600" : "text-neutral-500"}>
                      {passwordStrength.hasUppercase ? "✓" : "•"} One uppercase letter
                    </div>
                    <div className={passwordStrength.hasNumber ? "text-green-600" : "text-neutral-500"}>
                      {passwordStrength.hasNumber ? "✓" : "•"} One number
                    </div>
                    <div className={passwordStrength.hasSpecial ? "text-green-600" : "text-neutral-500"}>
                      {passwordStrength.hasSpecial ? "✓" : "•"} One special character (!@#$%^&*)
                    </div>
                  </div>
                </motion.div>
              )}

              {errors.password && <span className="text-xs text-red-600 mt-1 block">{errors.password.message}</span>}
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-2.5 border-2 rounded-lg transition focus:outline-none text-sm ${
                    errors.confirmPassword
                      ? "border-red-300 bg-red-50/30"
                      : "border-neutral-200 bg-white focus:border-[#2D5A27]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-700"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-xs text-red-600 mt-1 block">{errors.confirmPassword.message}</span>
              )}
            </motion.div>

            {/* Terms and conditions */}
            <motion.label
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-2 cursor-pointer"
            >
              <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-neutral-300 accent-[#2D5A27]" required />
              <span className="text-xs text-neutral-600">
                I agree to the terms and conditions
              </span>
            </motion.label>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              type="submit"
              disabled={isSubmitting || state?.success}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#2D5A27] to-[#3D7A37] hover:from-[#1F4620] hover:to-[#2D5A27] text-white font-semibold rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Admin Account
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 pt-6 border-t border-neutral-200 text-center"
          >
            <p className="text-neutral-600 text-xs">
              Already have an account?{" "}
              <Link href="/admin/login" className="text-[#2D5A27] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Auto-redirect on successful registration */}
      <AuthRedirect success={state?.success} userId={state?.userId} targetUrl="/admin" />
    </div>
  );
}
