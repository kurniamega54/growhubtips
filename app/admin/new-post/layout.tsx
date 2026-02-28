import { getCurrentUser } from "../auth-actions";
import { redirect } from "next/navigation";

/**
 * Editor Workspace Layout
 * Full-screen, zero-distraction editing environment
 * Overrides the standard admin layout for this route
 */
export default async function EditorWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F1F3F0] overflow-hidden">
      {children}
    </div>
  );
}
