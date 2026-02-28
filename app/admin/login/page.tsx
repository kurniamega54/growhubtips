"use client";

/**
 * Admin Login Page - Nature-Inspired Professional UI
 * Split-screen design with forest theme and smooth animations
 */

import { useState } from "react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, User, Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginAction } from "../auth-actions";
import { AuthRedirect } from "../components/AuthRedirect";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction] = useActionState(
    async (prev: unknown, formData: FormData) => {
      const email = formData.get("email");
      const password = formData.get("password");
      return await loginAction({ email, password });
    },
    null as any
  );

  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">
      {/* LEFT SIDE - FOREST BACKGROUND WITH MISSION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2D5A27] via-[#3D7A37] to-[#1F4620] relative overflow-hidden flex-col items-center justify-center p-12"
      >
        {/* Decorative forest background effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-900/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-800/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-green-700/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-md"
        >
          {/* Logo/Icon */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <span className="text-4xl">🌱</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={itemVariants} className="text-5xl font-bold text-white mb-6 leading-tight">
            GrowHubTips
          </motion.h1>

          {/* Mission Statement */}
          <motion.p variants={itemVariants} className="text-xl text-green-50 mb-8 leading-relaxed">
            Nurturing Your Green Thumb, One Tip at a Time
          </motion.p>

          {/* Subtext */}
          <motion.div variants={itemVariants} className="space-y-3 text-green-100">
            <p>🌿 Expert gardening advice for every plant parent</p>
            <p>🏡 From houseplants to urban farming</p>
            <p>📈 Watch your garden grow with us</p>
          </motion.div>
        </motion.div>

        {/* Bottom accent */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
        ></motion.div>
      </motion.div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 bg-[#F9F9F9]"
      >
        <div className="w-full max-w-sm">
          {/* Header */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-10">
            <h2 className="text-4xl font-bold text-[#2D5A27] mb-2">Welcome Back</h2>
            <p className="text-neutral-600">Sign in to access your admin dashboard</p>
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

          {/* Success message */}
          {state?.success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"
            >
              ✓ {state.message}
            </motion.div>
          )}

          {/* Login Form */}
          <form action={formAction} className="space-y-5">
            {/* Email Field */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="your@email.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition focus:outline-none ${
                    errors.email
                      ? "border-red-300 bg-red-50/30 focus:border-red-400"
                      : "border-neutral-200 bg-white focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10"
                  }`}
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-600 mt-1 block">{errors.email.message}</span>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition focus:outline-none ${
                    errors.password
                      ? "border-red-300 bg-red-50/30 focus:border-red-400"
                      : "border-neutral-200 bg-white focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-sm font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-600 mt-1 block">{errors.password.message}</span>
              )}
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 accent-[#2D5A27]" />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <a href="#" className="text-[#2D5A27] hover:underline font-medium">
                Forgot Password?
              </a>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              type="submit"
              disabled={isSubmitting || state?.success}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#2D5A27] to-[#3D7A37] hover:from-[#1F4620] hover:to-[#2D5A27] text-white font-semibold rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Sign In to Dashboard
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-neutral-200 text-center"
          >
            <p className="text-neutral-600 text-sm">
              First time here?{" "}
              <Link
                href="/admin/register"
                className="text-[#2D5A27] font-semibold hover:underline"
              >
                Create admin account
              </Link>
            </p>
          </motion.div>

          {/* Security badge */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
            className="mt-6 text-center text-xs text-neutral-500"
          >
            <p>🔒 Your connection is secure & encrypted</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Auto-redirect on successful login */}
      <AuthRedirect success={state?.success} userId={state?.userId} targetUrl="/admin" />
    </div>
  );
}
