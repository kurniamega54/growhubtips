import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-4xl font-bold text-primary-700 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-primary-600 mb-6 max-w-md">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-accent-500 text-white font-bold px-6 py-3 rounded-organic hover:bg-accent-600 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
