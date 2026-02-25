"use client";
export default function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4 p-8">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-6 bg-gray-200 rounded w-1/2" />
      <div className="h-96 bg-gray-200 rounded w-full" />
      <div className="h-6 bg-gray-200 rounded w-1/4" />
    </div>
  );
}
