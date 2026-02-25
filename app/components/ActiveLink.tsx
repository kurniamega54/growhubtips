"use client";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface ActiveLinkProps {
  href: string;
  children: ReactNode;
}

export function ActiveLink({ href, children }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <a
      href={href}
      className={`relative transition-colors px-2 py-1 ${isActive ? "text-forest font-bold" : "text-forest/80"}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="flex flex-col items-center">
        <AnimatePresence>
          {isActive && (
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="mb-1"
            >
              <Leaf size={16} className="text-sage" />
            </motion.span>
          )}
        </AnimatePresence>
        <span>{children}</span>
        {isActive && (
          <motion.span
            layoutId="underline"
            className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-sage"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          />
        )}
      </span>
    </a>
  );
}
