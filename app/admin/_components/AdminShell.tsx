"use client";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { EditorProvider } from "./EditorContext";
import SeoSidebarContainer from "./SeoSidebarContainer";

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <EditorProvider>
      <div className="w-screen h-screen bg-[#F1F3F0] grid grid-cols-[auto_1fr_320px] grid-rows-[auto_1fr] min-h-screen">
        <AdminSidebar />
        <div className="col-start-2 row-span-2 flex flex-col">
          <AdminHeader />
          <main className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
            {children}
          </main>
        </div>
        <aside className="col-start-3 row-span-2 bg-white border-l border-gray-100 shadow-organic flex flex-col overflow-y-auto">
          <SeoSidebarContainer />
        </aside>
      </div>
    </EditorProvider>
  );
}
