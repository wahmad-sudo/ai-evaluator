import "./globals.css";

export const metadata = {
  title: "VectorTechSol Evaluator",
  description: "Enterprise evaluation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
