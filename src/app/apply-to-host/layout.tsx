import ProtectedLayout from "../(protected)/layout";

export default function ApplyToHostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}