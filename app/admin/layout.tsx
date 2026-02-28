import React from "react";

export const metadata = {
  title: "Admin — GrowHubTips",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // This layout intentionally omits the public Header/Footer and provides
  // a full-viewport canvas for admin pages.
  return (
    <div className="min-h-screen h-screen w-full bg-[rgba(241,243,240,1)] text-gray-900">
      <main className="h-full w-full">{children}</main>
    </div>
  );
}
