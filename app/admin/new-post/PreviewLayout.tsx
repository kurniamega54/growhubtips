import AdminShell from "../_components/AdminShell";

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
