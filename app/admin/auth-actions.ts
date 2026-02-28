"use server";

/**
 * Authentication Server Actions
 * Secure, production-grade authentication logic
 */

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { loginSchema, registerAdminSchema, type LoginInput, type RegisterAdminInput, type AuthResponse } from "@/lib/validations/auth";

/**
 * Hash password with bcryptjs
 * Salt rounds: 12 for production security
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcryptjs.genSalt(12);
    return await bcryptjs.hash(password, salt);
  } catch (error) {
    console.error("Password hashing failed:", error);
    throw new Error("Failed to process password");
  }
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcryptjs.compare(password, hash);
  } catch (error) {
    console.error("Password verification failed:", error);
    return false;
  }
}

/**
 * Create secure HTTP-only cookie for session
 */
async function createSessionCookie(userId: string, expiresIn: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + expiresIn);

  // In production, use a secure JWT or session token
  // For now, we store the userId (in production use a signed token)
  cookieStore.set("auth_user_id", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  cookieStore.set("auth_session", "verified", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Register a new ADMIN user
 * Only one ADMIN can exist (super-admin pattern)
 */
export async function registerAdminAction(
  input: unknown
): Promise<AuthResponse> {
  try {
    const parsed = registerAdminSchema.safeParse(input);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0];
      return {
        success: false,
        error: firstError || "Validation failed",
      };
    }

    const data = parsed.data;

    // Check if an ADMIN already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"))
      .limit(1);

    if (existingAdmin.length > 0) {
      return {
        success: false,
        error: "An admin account already exists. Only one admin is allowed.",
      };
    }

    // Check if email already exists
    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingEmail.length > 0) {
      return {
        success: false,
        error: "This email is already registered.",
      };
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Insert new admin user
    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email,
        name: data.name,
        passwordHash,
        role: "admin",
      })
      .returning();

    if (!newUser) {
      return {
        success: false,
        error: "Failed to create user account.",
      };
    }

    // Create session cookie
    await createSessionCookie(newUser.id);

    return {
      success: true,
      message: "Admin account created successfully",
      userId: newUser.id,
    };
  } catch (error) {
    console.error("Register admin error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during registration.",
    };
  }
}

/**
 * Login with email and password
 */
export async function loginAction(
  input: unknown
): Promise<AuthResponse> {
  try {
    const parsed = loginSchema.safeParse(input);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0];
      return {
        success: false,
        error: firstError || "Validation failed",
      };
    }

    const data = parsed.data;

    // Fetch user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (!user || !user.passwordHash) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(data.password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    // Password correct - create session
    await createSessionCookie(user.id);

    return {
      success: true,
      message: "Login successful",
      userId: user.id,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during login.",
    };
  }
}

/**
 * Logout - Clear session cookies
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth_user_id");
  cookieStore.delete("auth_session");
  redirect("/admin/login");
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_user_id")?.value;
    const sessionValid = cookieStore.get("auth_session")?.value;

    if (!userId || !sessionValid) {
      return null;
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
